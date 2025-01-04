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
import { ApiResponseService } from 'src/modules/global/api-response.service';
import * as crypto from 'node:crypto';
import { cryptoHelper } from 'src/common/helpers/helperCrypto';
@Injectable()
export class AuthRepository {
  constructor(
    private readonly __userService: UserService,
    private JwtHelper: JwtHelper,
    private readonly __apiResponse: ApiResponseService,
    private cryptoHelper: cryptoHelper,
  ) {}
  async login(userAuthLogin: LoginUserDto): Promise<loginUserResponse> {
    const { user_name, password } = userAuthLogin;
    const user = await this.__userService.getUserByEmailOrUserName(
      user_name.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException(`El usuario ${user_name} no existe`);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const derivedKey = this.cryptoHelper.deriveMasterKey(password, user.id);

    console.log(derivedKey);

    const payload = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      status: user.status,
      derivedKey: derivedKey,
    };

    const user_response: auth_user = {
      email: user.email,
      id: user.id,
      status: user.status,
      is_admin: user.is_admin,
      user_name: user.user_name,
    };

    const token = this.JwtHelper.generateToken(payload);
    const expiration = this.JwtHelper.expiresIn(7200);

    return this.__apiResponse.success(
      { user: user_response },
      'inicio de sesion exitoso',
      { token, expiration },
    );
  }

  async register(
    userAuthPayload: CreateAuthUserDto,
  ): Promise<registerUserResponse> {
    const { email, user_name } = userAuthPayload;
    const user = await this.__userService.createUser({
      email: email.toLowerCase(),
      user_name: user_name.toLowerCase(),
      ...userAuthPayload,
    });

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
    const expiration = this.JwtHelper.expiresIn(7200);
    return this.__apiResponse.success(
      { user: user_response },
      'usuario registrado exitosamente',
      { token, expiration },
    );
  }

  async renew(payload: ReqUserToken) {
    const token = this.JwtHelper.generateToken(payload);
    const expiration = this.JwtHelper.expiresIn(7200);

    return this.__apiResponse.success(
      { user: payload },
      'token renovado con exito',
      { token, expiration },
    );
  }
}
