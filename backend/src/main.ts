import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';

  // CORS
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
  } else {
    // Development: allow any origin (useful for Electron and local dev servers)
    app.enableCors({
      origin: (origin, callback) => callback(null, true),
      credentials: true,
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`🚀 POS Backend running on http://localhost:${port}`);
}

bootstrap();

