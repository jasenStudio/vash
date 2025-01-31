import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';

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

  app.use(cookieParser(process.env.COOKIE_SECRET));
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
