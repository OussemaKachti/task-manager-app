import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(email: string, password: string, name?: string) {
    const supabase = this.supabaseService.getClient();
    
    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new BadRequestException(authError.message);
    }

    // ✅ Vérification que user existe
    if (!authData.user) {
      throw new BadRequestException('User creation failed');
    }

    // Créer l'entrée dans la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({ 
        id: authData.user.id, 
        email, 
        name 
      })
      .select()
      .single();

    if (userError) {
      throw new BadRequestException(userError.message);
    }

    return {
      user: userData,
      session: authData.session,
      access_token: authData.session?.access_token,
    };
  }

  async login(email: string, password: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // ✅ Vérification que user existe
    if (!data.user || !data.session) {
      throw new UnauthorizedException('Login failed');
    }

    return {
      user: data.user,
      access_token: data.session.access_token,
    };
  }

  async getProfile(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }
}