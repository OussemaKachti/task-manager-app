import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // Helper pour extraire userId du token (temporaire)
  private getUserIdFromToken(authorization: string): string {
    if (!authorization) {
      throw new UnauthorizedException('No authorization token provided');
    }
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return token;
  }

  // GET /tasks?projectId=xxx - Récupérer toutes les tâches d'un projet
  @Get()
  async findAll(@Query('projectId') projectId: string) {
    if (!projectId) {
      throw new Error('projectId query parameter is required');
    }
    return this.tasksService.findAllByProject(projectId);
  }

  // GET /tasks/:id - Récupérer une tâche
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // POST /tasks - Créer une tâche
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateTaskDto & { projectId: string },
    @Headers('authorization') authorization: string,
  ) {
    this.getUserIdFromToken(authorization);
    
    const { projectId, ...createTaskDto } = body;
    
    if (!projectId) {
      throw new Error('projectId is required');
    }
    
    return this.tasksService.create(projectId, createTaskDto);
  }

  // PUT /tasks/:id - Mettre à jour une tâche
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Headers('authorization') authorization: string,
  ) {
    this.getUserIdFromToken(authorization);
    return this.tasksService.update(id, updateTaskDto);
  }

  // PATCH /tasks/:id/status - Mettre à jour le statut (drag & drop)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'todo' | 'in_progress' | 'done'; orderIndex?: number },
    @Headers('authorization') authorization: string,
  ) {
    this.getUserIdFromToken(authorization);
    return this.tasksService.updateStatus(id, body.status, body.orderIndex);
  }

  // POST /tasks/reorder - Réorganiser les tâches
  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(
    @Body() body: { tasks: { id: string; order_index: number; status: string }[] },
    @Headers('authorization') authorization: string,
  ) {
    this.getUserIdFromToken(authorization);
    return this.tasksService.reorder(body.tasks);
  }

  // DELETE /tasks/:id - Supprimer une tâche
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    this.getUserIdFromToken(authorization);
    return this.tasksService.delete(id);
  }

  // GET /tasks/by-status?projectId=xxx&status=todo - Tâches par statut
  @Get('by-status')
  async findByStatus(
    @Query('projectId') projectId: string,
    @Query('status') status: 'todo' | 'in_progress' | 'done',
  ) {
    if (!projectId || !status) {
      throw new Error('projectId and status query parameters are required');
    }
    return this.tasksService.findByStatus(projectId, status);
  }
}