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
  ACCESS_TOKEN_COOKIE_DURATION,
  ACCESS_TOKEN_DURATION,
  errors,
  REFRESH_TOKEN_DURATION,
} from 'src/common/constants';
import { Response } from 'express';
import { CookieHelper } from 'src/common/helpers/helperCookie';
import { JwtService } from '@nestjs/jwt';
import { optimizedDataUserAgent } from 'src/common/decorators/user-agent/user-agent';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly __userService: UserService,
    private JwtHelper: JwtHelper,
    private readonly __apiResponse: ApiResponseService,
    private cryptoHelper: cryptoHelper,
    private prisma: PrismaService,
    private JwtService: JwtService,
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
      user_agent: userAgent,
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

    const token = this.JwtHelper.generateAccessToken(
      payload,
      ACCESS_TOKEN_DURATION,
    );

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

    const token = this.JwtHelper.generateAccessToken(
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

    return this.__apiResponse.success(
      { user: user_response },
      'usuario registrado exitosamente',
      { token },
    );
  }

  async renew(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userAgent: string,
    device: string,
  ) {
    const decodedRefreshTokenCurrent = this.JwtHelper.decodeToken(refreshToken);
    const decodedAccessTokenCurrent = this.JwtHelper.decodeToken(accessToken);

    const userAgentCurrent = optimizedDataUserAgent(userAgent, device);

    try {
      const { user } = await this.JwtHelper.verifyAccessTokens(
        res,
        accessToken,
        refreshToken,
        decodedRefreshTokenCurrent,
        userAgentCurrent,
      );

      return this.__apiResponse.success({ user }, 'Token Valido');
    } catch (accessTokenError) {
      try {
        if (
          accessTokenError.response.error ===
          errors.auth.accessToken.revoked.error
        ) {
          await this.JwtHelper.revokeTokensByUserAgent({
            res,
            accessToken,
            refreshToken,
            storedRefreshToken: decodedRefreshTokenCurrent,
            decodedRefreshToken: decodedRefreshTokenCurrent,
            accessTokenPayloadVerified: this.JwtHelper.decodeToken(accessToken),
          });
        }

        const { newAccessTokenPayload } =
          await this.JwtHelper.verifyRefreshTokens(res, refreshToken);

        return this.__apiResponse.success(
          { user: newAccessTokenPayload },
          'Tokens renovados exitosamente',
        );
      } catch (error) {
        if (decodedAccessTokenCurrent) {
          await this.JwtHelper.revokedToken(
            decodedAccessTokenCurrent,
            accessToken,
            'ACCESS',
          );
        }

        if (decodedRefreshTokenCurrent) {
          await this.prisma.refreshToken.deleteMany({
            where: decodedRefreshTokenCurrent.jti,
          });

          await this.JwtHelper.revokedToken(
            decodedRefreshTokenCurrent,
            refreshToken,
            'REFRESH',
          );
        }

        CookieHelper.clearSessionCookies(res);

        throw new UnauthorizedException('Token inválido o expirado');
      }
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    try {
      if (accessToken.length > 0) {
        const decodeAccessToken = this.JwtHelper.decodeToken(accessToken);
        if (decodeAccessToken.jti) {
          await this.JwtHelper.revokedToken(
            decodeAccessToken,
            accessToken,
            'ACCESS',
          );
        }
      }

      const decodeRefreshToken = this.JwtHelper.decodeToken(refreshToken);

      if (!decodeRefreshToken) {
        throw new ForbiddenException(
          'Tokens inválidos: no se pudieron decodificar',
        );
      }

      await this.prisma.refreshToken.deleteMany({
        where: {
          jti: decodeRefreshToken.jti,
        },
      });

      await this.JwtHelper.revokedToken(
        decodeRefreshToken,
        refreshToken,
        'REFRESH',
      );

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

    const token_hash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        jti,
        user_agent,
        token_hash,
        user_id: userId,
        expires_at: expiresAt,
      },
    });

    return refreshToken;
  }
}
