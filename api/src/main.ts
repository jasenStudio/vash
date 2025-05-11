import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import * as cookieParser from 'cookie-parser';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';
import { doubleCsrfProtection } from './common/helpers/HelpersCsrf';

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

  app.use(cookieParser(process.env.CSRF_SECRET));

  // const { doubleCsrfProtection, validateRequest, invalidCsrfTokenError } =
  //   doubleCsrf(csrfOptions);

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('use middleware');

    console.log('Header:', req.headers['x-csrf-token']);
    console.log('Cookie:', req.cookies['x-csrf-token']);
    const csrfExemptRoutes = [
      '/api/auth/logout',
      '/api/auth/sign-in',
      '/api/auth/sign-up',
      '/api/auth/token-csrf',
      '/api/auth/renew',
    ];

    const isModifyingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      req.method,
    );
    const isExemptRoute = csrfExemptRoutes.some((route) =>
      req.path.startsWith(route),
    );

    if (isModifyingMethod && !isExemptRoute) {
      try {
        return doubleCsrfProtection(req, res, next);
      } catch (error) {
        console.error('CSRF middleware error:', error);
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
    }
    next();
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
