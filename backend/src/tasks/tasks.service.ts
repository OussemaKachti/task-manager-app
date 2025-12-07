import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  order_index?: number;
}

@Injectable()
export class TasksService {
  constructor(private supabaseService: SupabaseService) {}

  // Récupérer toutes les tâches d'un projet
  async findAllByProject(projectId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data;
  }

  // Récupérer une tâche spécifique
  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data;
  }

  // Créer une nouvelle tâche
  async create(projectId: string, createTaskDto: CreateTaskDto) {
    const supabase = this.supabaseService.getClient();
    
    // Récupérer le plus grand order_index pour ce projet
    const { data: lastTask } = await supabase
      .from('tasks')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = lastTask ? lastTask.order_index + 1 : 0;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: projectId,
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || 'todo',
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data;
  }

  // Mettre à jour une tâche
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const supabase = this.supabaseService.getClient();
    
    // Vérifier que la tâche existe
    await this.findOne(id);

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updateTaskDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data;
  }

  // Mettre à jour le statut d'une tâche (pour le drag & drop)
  async updateStatus(id: string, status: 'todo' | 'in_progress' | 'done', orderIndex?: number) {
    const supabase = this.supabaseService.getClient();
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (orderIndex !== undefined) {
      updateData.order_index = orderIndex;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task status: ${error.message}`);
    }

    return data;
  }

  // Réorganiser les tâches (drag & drop)
  async reorder(tasks: { id: string; order_index: number; status: string }[]) {
  const supabase = this.supabaseService.getClient();
  
  // Mettre à jour toutes les tâches en une seule transaction
  const updates = tasks.map(task => 
    supabase
      .from('tasks')
      .update({ 
        order_index: task.order_index,
        status: task.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', task.id)
  );

  const results = await Promise.all(updates);
  
  const errors = results.filter(result => result.error);
  if (errors.length > 0 && errors[0]?.error) { // ← Ajoutez ?.error
    throw new Error(`Failed to reorder tasks: ${errors[0].error.message}`);
  }

  return { message: 'Tasks reordered successfully' };
}

  // Supprimer une tâche
  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    
    // Vérifier que la tâche existe
    await this.findOne(id);

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return { message: 'Task deleted successfully' };
  }

  // Récupérer les tâches par statut
  async findByStatus(projectId: string, status: 'todo' | 'in_progress' | 'done') {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', status)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks by status: ${error.message}`);
    }

    return data;
  }
}