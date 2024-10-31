import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAuthUserDto, LoginUserDto, ReqUserToken } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRespository: AuthRepository) {}
  async login(userLoginPayload: LoginUserDto) {
    const { user, token, ok } =
      await this.authRespository.login(userLoginPayload);

    return { ok, user, token };
  }

  async register(authUserPayload: CreateAuthUserDto) {
    const { user, token } =
      await this.authRespository.register(authUserPayload);
    return {
      ok: true,
      user: user,
      token,
    };
  }

  async renewToken(user: ReqUserToken) {
    return await this.authRespository.renew(user);
  }
}
