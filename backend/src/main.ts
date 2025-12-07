import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Activer CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL du frontend
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // ✅ Utiliser le port 3001 (comme dans ton README)
  await app.listen(process.env.PORT ?? 3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();