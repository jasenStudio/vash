import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthUserDto, LoginUserDto, ReqUserToken } from '../dto/auth.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtHelper } from '../../../common/helpers/helperJwt';
import {
  auth_user,
  loginUserResponse,
  registerUserResponse,
} from '../entities/auth-user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthRepository {
  constructor(
    private readonly __userService: UserService,
    private JwtHelper: JwtHelper,
  ) {}
  async login(userAuthLogin: LoginUserDto): Promise<loginUserResponse> {
    const { user_name, password } = userAuthLogin;
    const user = await this.__userService.getUserByEmailOrUserName(user_name);

    if (!user) {
      throw new NotFoundException(
        `El usuario con el id ${user_name} no se encuentra`,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      status: user.status,
    };

    const user_response: auth_user = {
      email: user.email,
      id: user.id,
      status: user.status,
      is_admin: user.is_admin,
      user_name: user.user_name,
    };

    return {
      ok: true,
      user: user_response,
      token: this.JwtHelper.generateToken(payload),
      expiration: this.JwtHelper.expiresIn(7200),
    };
  }

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
      ok: true,
      user: user_response,
      token,
      expiration: this.JwtHelper.expiresIn(7200),
    };
  }

  async renew(payload: ReqUserToken) {
    return {
      ok: true,
      user: payload,
      token: await this.JwtHelper.generateToken(payload),
      expiration: this.JwtHelper.expiresIn(7200),
    };
  }
}
