import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAuthUserDto } from '../dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly authRespository: AuthRepository,
  ) {}
  async login({ email, password }: { email: string; password: string }) {
    return this.userService.getUserByEmailOrUserName(email);
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
}
