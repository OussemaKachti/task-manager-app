import { Controller, Post, Body, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { email: string; password: string; name?: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  async getProfile(@Request() req) {
    // Pour l'instant, on va le tester sans guard
    // Plus tard on ajoutera un AuthGuard
    const userId = req.headers.authorization?.split(' ')[1]; // Récupère le token
    
    if (!userId) {
      throw new Error('Unauthorized');
    }
    
    return this.authService.getProfile(userId);
  }
}