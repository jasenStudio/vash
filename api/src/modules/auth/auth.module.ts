import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtHelper } from 'src/common/helpers/helperJwt';
import { cryptoHelper } from 'src/common/helpers/helperCrypto';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: `.env.${process.env.NODE_ENV || 'development'}`,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtHelper, cryptoHelper],
  exports: [AuthService],
})
export class AuthModule {}
