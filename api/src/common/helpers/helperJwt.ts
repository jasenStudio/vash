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

interface revokedTokenSchema {
  jti: string;
  id: number;
  exp: any;
}

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(config.KEY)
    private __config: ConfigType<typeof config>,
    private readonly prisma: PrismaService,
  ) {}

  generateToken(payload: any, duration: string = '15m'): string {
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

  async verifyAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.__config.api_secret,
      });

      const isTokenRevoked = await this.prisma.revokedToken.findUnique({
        where: { jti: payload.jti, type: 'ACCESS' },
      });

      if (isTokenRevoked) {
        throw new ForbiddenException('Access token ha sido revocado');
      }

      return payload;
    } catch (error) {
      console.error('Error al verificar el access token:', error);
      throw new ForbiddenException('Access token inválido o expirado!');
    }
  }

  async verifyRefreshToken(token: string) {
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

      return payload;
    } catch (error) {
      console.error('Error al verificar el access token:', error);
      throw new ForbiddenException('refresh token inválido o expirado!');
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
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
      throw new ForbiddenException('refresh token inválido o expirado!');
    }
  }

  expiresIn(seconds: number) {
    const expirationDate = new Date(Date.now() + seconds * 1000);
    return expirationDate.toISOString();
  }
}
