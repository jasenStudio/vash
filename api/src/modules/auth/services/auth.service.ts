import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAuthUserDto, LoginUserDto, ReqUserToken } from '../dto/auth.dto';
import { loginUserResponse } from '../entities/auth-user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRespository: AuthRepository) {}
  async login(userLoginPayload: LoginUserDto) {
    const { user, token, ok, expiration } =
      await this.authRespository.login(userLoginPayload);

    return { ok, user, token, expiration };
  }

  async register(authUserPayload: CreateAuthUserDto) {
    const { user, token, ok, expiration } =
      await this.authRespository.register(authUserPayload);
    return {
      ok,
      user: user,
      token,
      expiration,
    };
  }

  async renewToken(user: ReqUserToken) {
    return await this.authRespository.renew(user);
  }
}
