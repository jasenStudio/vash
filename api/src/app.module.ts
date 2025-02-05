import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import * as Joi from 'joi';

//* Modules and Helpers
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from './modules/global/global.module';
import { JwtHelper } from './common/helpers/helperJwt';
import { ServiceModule } from './modules/services_platform_web/service.module';
import { SubcriptionModule } from './modules/subcription/subcription.module';
import { SubcriptionService } from './modules/subcription/services/subcription.service';
import { UserModule } from './modules/user/user.module';
import { ValidateToken } from './common/middlewares/validateJwt.middleware';
import { PrismaService } from './modules/prisma/services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        API_KEY_SECRET: Joi.string().required(),
        API_KEY_SECRET_REFRESH: Joi.string().required(),
        SALT_HASH: Joi.string().required(),
      }),
    }),
    AccountModule,
    AuthModule,
    GlobalModule,
    ServiceModule,
    SubcriptionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtHelper, SubcriptionService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateToken)
      .forRoutes('users', 'subcription', 'subcriptions-details', 'accounts');
  }
}
