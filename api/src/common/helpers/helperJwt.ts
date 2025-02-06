import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { ConfigType } from '@nestjs/config';
import config from '../../config/configuration';
import * as bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_COOKIE_DURATION,
  ACCESS_TOKEN_DURATION,
  errors,
} from '../constants';
import { CookieHelper } from './helperCookie';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface revokedTokenSchema {
  jti: string;
  id: number;
  exp: any;
}

interface ObjectAccessToken {
  accessToken: string;
  decodeAccessToken: revokedTokenSchema;
}

interface dataTokens {
  res: Response;
  accessToken: string;
  refreshToken: string;
  decodedRefreshToken: any; //TODO Pendiente por tipar
  accessTokenPayloadVerified: any;
  storedRefreshToken: any;
}

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(config.KEY)
    private __config: ConfigType<typeof config>,
    private readonly prisma: PrismaService,
  ) {}

  decodeToken(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      console.log(error);
    }
  }

  generateAccessToken(payload: any, duration: string = '15m'): string {
    try {
      return this.jwtService.sign(payload, {
        expiresIn: duration,
        secret: this.__config.api_secret,
      });
    } catch (error) {
      console.log(error);
    }
  }

  generateRefreshToken(payload: any, duration: string = '7d'): string {
    try {
      return this.jwtService.sign(payload, {
        expiresIn: duration,
        secret: this.__config.api_secret_refresh,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async verifyAndCheckAccessTokenStatus(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.__config.api_secret,
      });

      const isTokenRevoked = await this.prisma.revokedToken.findUnique({
        where: { jti: payload.jti, type: 'ACCESS' },
      });

      if (isTokenRevoked) {
        console.log('revocado');
        throw new ForbiddenException(errors.auth.accessToken.revoked);
      }

      return payload;
    } catch (error) {
      if (error.response.error === errors.auth.accessToken.revoked.error) {
        throw error;
      }

      throw new ForbiddenException(errors.auth.accessToken.invalid);
    }
  }

  async verifyAndCheckRefreshTokenStatus(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.__config.api_secret_refresh,
      });

      const revokedRefreshToken = await this.prisma.revokedToken.findUnique({
        where: {
          jti: payload.jti,
          type: 'REFRESH',
        },
      });

      if (revokedRefreshToken) {
        throw new ForbiddenException('Refresh token revocado');
      }

      const storedRefreshToken = await this.prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
      });

      if (!storedRefreshToken) {
        throw new ForbiddenException(
          'Refresh token inválido o no registrado en el stored',
        );
      }

      return { ...payload, user_agent: storedRefreshToken.user_agent };
    } catch (error) {
      console.error('Error al verificar el access token:', error);
      throw new ForbiddenException('refresh token inválido o expirado!');
    }
  }

  async revokedToken(
    decodeToken: revokedTokenSchema,
    token: string,
    type: 'ACCESS' | 'REFRESH',
  ) {
    try {
      if (!decodeToken.jti && !decodeToken.id && !decodeToken.exp) {
        throw new UnauthorizedException('Invalid decoded token');
      }

      const revokedToken = await this.prisma.revokedToken.upsert({
        where: { jti: decodeToken.jti },
        update: {},
        create: {
          type,
          jti: decodeToken.jti,
          user_id: decodeToken.id,
          expires_at: new Date(decodeToken.exp * 1000),
          token_hash: await bcrypt.hash(token, 10),
        },
      });

      return revokedToken;
    } catch (error) {
      console.error(`Error al revocar el ${type}_TOKEN`, error);
      throw new ForbiddenException(`${type}_TOKEN inválido o expirado!`);
    }
  }

  async revokeTokensByUserAgent({
    accessToken,
    accessTokenPayloadVerified,
    decodedRefreshToken,
    refreshToken,
    res,
    storedRefreshToken,
  }: dataTokens) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        jti: storedRefreshToken.jti,
      },
    });

    console.log('debe salir en error');
    await this.revokedToken(accessTokenPayloadVerified, accessToken, 'ACCESS');

    await this.revokedToken(decodedRefreshToken, refreshToken, 'REFRESH');

    CookieHelper.clearSessionCookies(res);

    throw new ForbiddenException(
      'Actividad sospechosa detectada. Inicie sesión nuevamente.',
    );
  }

  async verifyAccessTokens(
    res: Response,
    accessToken: string,
    refreshToken: string,
    decodedRefreshTokenCurrent: any,
    userAgentCurrent: string,
  ) {
    try {
      if (!accessToken) {
        throw new UnauthorizedException('Access Token falta o es invalido');
      }

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh Token falta o es invalido');
      }

      const accessTokenPayloadVerified =
        await this.verifyAndCheckAccessTokenStatus(accessToken);

      const storedRefreshToken = await this.prisma.refreshToken.findUnique({
        where: { jti: decodedRefreshTokenCurrent.jti },
      });

      if (!storedRefreshToken) {
        throw new ForbiddenException('Refresh token inválido o no encontrado.');
      }

      if (
        accessTokenPayloadVerified.user_agent !== userAgentCurrent ||
        storedRefreshToken.user_agent !== userAgentCurrent
      ) {
        console.log('aui debe enterar');
        await this.revokeTokensByUserAgent({
          res,
          accessToken,
          refreshToken,
          storedRefreshToken,
          decodedRefreshToken: decodedRefreshTokenCurrent,
          accessTokenPayloadVerified,
        });
      }

      const { jti, derivedKey, iat, exp, ...user } = accessTokenPayloadVerified;

      return {
        user,
        jti,
        derivedKey,
        exp,
        iat,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyRefreshTokens(res: Response, refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException(errors.auth.session.expired);
      }

      const refreshTokenPayload =
        await this.verifyAndCheckRefreshTokenStatus(refreshToken);

      const { jti, exp, iat, ...newAccessTokenPayload } = refreshTokenPayload;

      const newAccessToken = this.generateAccessToken(
        { jti: uuidv4(), ...newAccessTokenPayload },
        ACCESS_TOKEN_DURATION,
      );

      CookieHelper.clearCookie(res, 'access_token');

      CookieHelper.setCookie(
        res,
        'access_token',
        newAccessToken,
        ACCESS_TOKEN_COOKIE_DURATION,
      );

      return { refreshTokenPayload, newAccessToken, newAccessTokenPayload };
    } catch (error) {
      throw error;
    }
  }
}
