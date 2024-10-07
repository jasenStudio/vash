import { Injectable } from '@nestjs/common';
import { CreateAuthUserDto } from '../dto/auth.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtHelper } from '../../../common/helpers/helperJwt';
import { auth_user, registerUserResponse } from '../entities/auth-user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly __userService: UserService,
    private JwtHelper: JwtHelper,
  ) {}
  async login() {}

  async register(
    userAuthPayload: CreateAuthUserDto,
  ): Promise<registerUserResponse> {
    const user = await this.__userService.createUser(userAuthPayload);

    const token = this.JwtHelper.generateToken({
      id: user.id,
      user: user.email,
      is_admin: user.is_admin,
      status: user.status,
    });

    const user_response: auth_user = {
      email: user.email,
      id: user.id,
      status: user.status,
      is_admin: user.is_admin,
      user_name: user.user_name,
    };

    return {
      user: user_response,
      token,
    };
  }
}
