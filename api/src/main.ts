import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import * as cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';
const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET, // Cambia esto por una clave secreta segura
  cookieName: 'csrf-token', // Nombre de la cookie que contendrá el token CSRF
  cookieOptions: {
    httpOnly: true,
    secure: true, // Asegúrate de que esto esté en true para producción
    sameSite: 'none', // Opcional, pero recomendado para mayor seguridad
  },
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());

  // app.enableCors({
  //   origin: 'http://localhost:5173/',
  //   methods: 'GET,POST,PUT,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  //   credentials: true,
  // });

  app.use(cookieParser(process.env.CSRF_SECRET));
  app.use((req: Request, res: Response, next: NextFunction) => {
    const csrfExemptRoutes = [
      '/api/auth/logout',
      '/api/auth/sign-in',
      '/api/auth/sign-up',
      '/api/auth/token-csrf',
      '/api/auth/renew',
    ]; // Rutas que NO necesitan CSRF

    if (
      (req.method === 'POST' ||
        req.method === 'PUT' ||
        req.method === 'DELETE') &&
      !csrfExemptRoutes.includes(req.path) // Solo proteger si NO está en la lista
    ) {
      return doubleCsrfProtection(req, res, next);
    }

    next(); // Continuar sin protección CSRF en rutas excluidas
  });
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'prod'
        ? 'https://vash.onrender.com'
        : 'http://localhost:5173',
    credentials: true,
  });

  console.log(
    process.env.NODE_ENV === 'prod'
      ? 'https://vash.onrender.com'
      : 'http://localhost:5173',
  );

  const config = new DocumentBuilder()
    .setTitle('Vash')
    .setDescription('The vash API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
