// app/projects/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tasks, projects as projectsApi } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  order_index: number;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
          >
            <GripVertical size={18} />
          </button>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { showToast, ToastContainer } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in_progress' | 'done',
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsApi.getOne(projectId),
        tasks.getAll(projectId),
      ]);
      setProject(projectRes.data);
      setTasksList(tasksRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasksList
      .filter((task) => task.status === status)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await tasks.update(editingTask.id, newTask);
        showToast('✏️ Task updated successfully!', 'success');
      } else {
        await tasks.create(projectId, newTask);
        showToast('✅ Task created successfully!', 'success');
      }
      setShowModal(false);
      setEditingTask(null);
      setNewTask({ title: '', description: '', status: 'todo' });
      loadData();
    } catch (error) {
      showToast('Failed to save task', 'error');
      console.error('Failed to save task', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      try {
        await tasks.delete(id);
        showToast('🗑️ Task deleted successfully', 'success');
        loadData();
      } catch (error) {
        showToast('Failed to delete task', 'error');
        console.error('Failed to delete task', error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setShowModal(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasksList.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    
    // Check if dropped on a column
    if (['todo', 'in_progress', 'done'].includes(overId)) {
      const newStatus = overId as 'todo' | 'in_progress' | 'done';
      if (activeTask.status !== newStatus) {
        try {
          const tasksInNewColumn = getTasksByStatus(newStatus);
          await tasks.updateStatus(activeTask.id, newStatus, tasksInNewColumn.length);
          
          const statusLabels = {
            todo: 'To Do',
            in_progress: 'In Progress',
            done: 'Done'
          };
          showToast(`📊 Task moved to ${statusLabels[newStatus]}`, 'success');
          loadData();
        } catch (error) {
          showToast('Failed to update task status', 'error');
          console.error('Failed to update task status', error);
        }
      }
      return;
    }

    // Reordering within same column
    const overTask = tasksList.find((t) => t.id === overId);
    if (!overTask || activeTask.status !== overTask.status) return;

    const columnTasks = getTasksByStatus(activeTask.status);
    const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
    const newIndex = columnTasks.findIndex((t) => t.id === over.id);

    if (oldIndex !== newIndex) {
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
      const updatedTasks = reorderedTasks.map((task, index) => ({
        id: task.id,
        order_index: index,
      }));

      try {
        await tasks.reorder(updatedTasks);
        showToast('🔄 Tasks reordered', 'success');
        loadData();
      } catch (error) {
        showToast('Failed to reorder tasks', 'error');
        console.error('Failed to reorder tasks', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const columns = [
    { id: 'todo', title: '📝 To Do', color: 'bg-gray-100' },
    { id: 'in_progress', title: '🚧 In Progress', color: 'bg-blue-100' },
    { id: 'done', title: '✅ Done', color: 'bg-green-100' },
  ];

  const activeTask = tasksList.find((t) => t.id === activeId);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/projects')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project?.name}
                </h1>
                {project?.description && (
                  <p className="text-gray-600 text-sm">{project.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setNewTask({ title: '', description: '', status: 'todo' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              return (
                <div
                  key={column.id}
                  className="bg-gray-100 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">
                      {column.title}
                    </h2>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <SortableContext
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[200px] max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg opacity-90 rotate-3">
                <h4 className="font-medium text-gray-900">{activeTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as 'todo' | 'in_progress' | 'done',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setNewTask({ title: '', description: '', status: 'todo' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}