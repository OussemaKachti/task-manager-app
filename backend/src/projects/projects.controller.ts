import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // Helper pour extraire userId du token (temporaire)
  private getUserIdFromToken(authorization: string): string {
    if (!authorization) {
      throw new UnauthorizedException('No authorization token provided');
    }
    
    // Pour l'instant, on suppose que le token contient le userId
    // Plus tard, on ajoutera un vrai JWT Guard
    const token = authorization.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return token; // Temporaire - à remplacer par vraie validation JWT
  }

  @Get()
  async findAll(@Headers('authorization') authorization: string) {
    const userId = this.getUserIdFromToken(authorization);
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    const userId = this.getUserIdFromToken(authorization);
    return this.projectsService.findOne(id, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: { name: string; description?: string },
    @Headers('authorization') authorization: string,
  ) {
    const userId = this.getUserIdFromToken(authorization);
    return this.projectsService.create(userId, body.name, body.description);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
    @Headers('authorization') authorization: string,
  ) {
    const userId = this.getUserIdFromToken(authorization);
    return this.projectsService.update(id, userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    const userId = this.getUserIdFromToken(authorization);
    return this.projectsService.delete(id, userId);
  }
}