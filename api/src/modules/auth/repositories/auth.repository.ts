import {
  ForbiddenException,
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
import { cryptoHelper } from 'src/common/helpers/helperCrypto';
import { PrismaService } from '../../prisma/services/prisma.service';

import { v4 as uuidv4 } from 'uuid'; // Para generar UUIDs
import {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} from 'src/common/constants';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly __userService: UserService,
    private JwtHelper: JwtHelper,
    private readonly __apiResponse: ApiResponseService,
    private cryptoHelper: cryptoHelper,
    private prisma: PrismaService,
  ) {}
  async login(
    userAuthLogin: LoginUserDto,
    userAgent: string,
  ): Promise<loginUserResponse> {
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

    const payload = {
      jti: uuidv4(),
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      status: user.status,
      derivedKey: derivedKey,
    };

    const { jti, ...payloadRefresh } = payload;

    const payloadRefreshToken = {
      jti: uuidv4(),
      ...payloadRefresh,
    };

    const user_response: auth_user = {
      email: user.email,
      id: user.id,
      status: user.status,
      is_admin: user.is_admin,
      user_name: user.user_name,
    };

    const token = this.JwtHelper.generateToken(payload, ACCESS_TOKEN_DURATION);

    const refreshToken = this.JwtHelper.generateRefreshToken(
      payloadRefreshToken,
      REFRESH_TOKEN_DURATION,
    );

    await this.saveRefreshToken(user.id, refreshToken, userAgent);

    return this.__apiResponse.success(
      { user: user_response },
      'inicio de sesion exitoso',
      { token, refreshToken },
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

    const token = this.JwtHelper.generateToken(
      {
        id: user.id,
        user: user.email,
        is_admin: user.is_admin,
        status: user.status,
      },
      '15m',
    );

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
    console.log({ payload }, 'user');
    const token = this.JwtHelper.generateToken(payload);
    const expiration = this.JwtHelper.expiresIn(7200);

    return this.__apiResponse.success(
      { user: payload },
      'token renovado con exito',
      { token, expiration },
    );
  }

  async logout(accessToken: string, refreshToken: string) {
    try {
      // Decodificar los tokens
      const decodeAccessToken = this.JwtHelper.decodeToken(accessToken);
      const decodeRefreshToken = this.JwtHelper.decodeToken(refreshToken);

      if (!decodeAccessToken || !decodeRefreshToken) {
        throw new ForbiddenException(
          'Tokens inválidos: no se pudieron decodificar',
        );
      }

      // Eliminar el refresh token de la tabla de refresh tokens activos
      await this.prisma.refreshToken.deleteMany({
        where: {
          jti: decodeRefreshToken.jti,
        },
      });

      // Agregar el access token a la lista de tokens revocados (usando upsert)
      // await this.prisma.revokedToken.upsert({
      //   where: {
      //     jti: decodeAccessToken.jti,
      //   },
      //   update: {}, // No es necesario actualizar nada si ya existe
      //   create: {
      //     type: 'ACCESS',
      //     jti: decodeAccessToken.jti,
      //     user_id: decodeAccessToken.id,
      //     expires_at: new Date(decodeAccessToken.exp * 1000),
      //     token_hash: accessToken, // Hashear el token (opcional)
      //   },
      // });

      await this.JwtHelper.revokedToken(
        decodeAccessToken,
        accessToken,
        'ACCESS',
      );

      await this.JwtHelper.revokedToken(
        decodeRefreshToken,
        refreshToken,
        'REFRESH',
      );
      // Agregar el refresh token a la lista de tokens revocados (usando upsert)
      // await this.prisma.revokedToken.upsert({
      //   where: {
      //     jti: decodeRefreshToken.jti,
      //   },
      //   update: {}, // No es necesario actualizar nada si ya existe
      //   create: {
      //     type: 'REFRESH',
      //     jti: decodeRefreshToken.jti,
      //     user_id: decodeRefreshToken.id,
      //     expires_at: new Date(decodeRefreshToken.exp * 1000),
      //     // token_hash: await bcrypt.hash(refreshToken, 10), // Hashear el token (opcional)
      //     token_hash: refreshToken,
      //   },
      // });

      return { message: 'Sesión cerrada exitosamente' };
    } catch (error) {
      throw new ForbiddenException(
        'Error al cerrar la sesión: ' + error.message,
      );
    }
  }

  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    user_agent: string,
  ) {
    const { jti } = this.JwtHelper.decodeToken(refreshToken);

    console.log(this.JwtHelper.decodeToken(refreshToken));

    // Hashear el refresh token antes de almacenarlo
    const token_hash = await bcrypt.hash(refreshToken, 10);
    // Calcular la fecha de expiración (7 días a partir de ahora)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Crear el registro en la base de datos
    await this.prisma.refreshToken.create({
      data: {
        jti,
        user_agent,
        token_hash, // Campo correcto según el esquema
        user_id: userId, // ID del usuario
        expires_at: expiresAt, // Fecha de expiración
      },
    });

    return refreshToken;
  }
}
