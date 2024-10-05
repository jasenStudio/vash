import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
      // validationSchema:Joi.object({

      // })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
