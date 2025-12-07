import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // Autorise ton futur site Vercel et le localhost pour le développement
    origin: '*', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Railway injecte un PORT variable. Ton app DOIT écouter sur process.env.PORT.
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();