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
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

import { ValidateToken } from './common/middlewares/validateJwt.middleware';
import { JwtHelper } from './common/helpers/helperJwt';
import { ServiceModule } from './modules/services_platform_web/service.module';
import { AccountModule } from './modules/account/account.module';
import { SubcriptionService } from './modules/subcription/services/subcription.service';
import { SubcriptionModule } from './modules/subcription/subcription.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        API_KEY_SECRET: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    ServiceModule,
    AccountModule,
    SubcriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtHelper, SubcriptionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateToken)
      .forRoutes('users', 'subcription', 'subcriptions-details', {
        path: 'auth/renew',
        method: RequestMethod.GET,
      });
  }
}
