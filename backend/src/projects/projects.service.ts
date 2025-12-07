import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data;
  }

  async create(userId: string, name: string, description?: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name,
        description,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  }

  async update(id: string, userId: string, updates: { name?: string; description?: string }) {
    const supabase = this.supabaseService.getClient();
    
    // Vérifier que le projet appartient à l'utilisateur
    await this.findOne(id, userId);

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return data;
  }

  async delete(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Vérifier que le projet appartient à l'utilisateur
    await this.findOne(id, userId);

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    return { message: 'Project deleted successfully' };
  }
}