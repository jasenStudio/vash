import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAuthUserDto, LoginUserDto, ReqUserToken } from '../dto/auth.dto';
import { loginUserResponse } from '../entities/auth-user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly authRespository: AuthRepository) {}
  async login(userLoginPayload: LoginUserDto, userAgent: string) {
    const loginUser = await this.authRespository.login(
      userLoginPayload,
      userAgent,
    );
    return loginUser;
  }

  async register(authUserPayload: CreateAuthUserDto) {
    const registerUser = await this.authRespository.register(authUserPayload);
    console.log(registerUser);
    return registerUser;
  }

  async renewToken(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userAgent: string,
    device: string,
  ) {
    return await this.authRespository.renew(
      res,
      accessToken,
      refreshToken,
      userAgent,
      device,
    );
  }

  async logout(accessToken: string, refreshToken: string) {
    return await this.authRespository.logout(accessToken, refreshToken);
  }
}
