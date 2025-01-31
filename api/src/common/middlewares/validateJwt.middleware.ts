import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../helpers/helperJwt';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { optimizedDataUserAgent } from '../decorators/user-agent/user-agent';
import { v4 as uuidv4 } from 'uuid';
import { CookieHelper } from '../helpers/helperCookie';
import { ACCESS_TOKEN_COOKIE_DURATION } from '../constants';

@Injectable()
export class ValidateToken implements NestMiddleware {
  constructor(
    private JwtHelper: JwtHelper,
    private prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('api/auth/renew')) {
      return next();
    }
    //1. Obtener cookies y cabeceras
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    const userAgent = req.headers['user-agent'];

    const customHeader = req.headers['x-device-info']
      ? (req.headers['x-device-info'] as string)
      : 'Desktop';

    if (!accessToken) {
      throw new UnauthorizedException(
        'Token de autentificacion falta o es invalido ',
      );
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Token de refresh falta o es invalido ');
    }

    const userAgentOptimizado = optimizedDataUserAgent(userAgent, customHeader);

    //2. decodificar el refreshToken
    const decodedRefreshToken = this.JwtHelper.decodeToken(refreshToken);
    const { jti: jtiRefreshToken } = decodedRefreshToken;

    if (!jtiRefreshToken) {
      throw new ForbiddenException('Token inválido: falta el jti');
    }

    try {
      // 3. verificar si el token es valido
      const accessTokenPayload =
        await this.JwtHelper.verifyAccessToken(accessToken);

      //4. Obtener el refresh token almacenado y verificar el User-Agent del client
      const storedRefreshToken = await this.prisma.refreshToken.findUnique({
        where: {
          jti: jtiRefreshToken, // Buscar por el jti del refresh token
        },
      });

      if (storedRefreshToken.user_agent !== userAgentOptimizado) {
        // Si el User-Agent no coincide, revocar el token

        await this.JwtHelper.revokedToken(
          {
            jti: accessTokenPayload.jti,
            id: accessTokenPayload.id,
            exp: accessTokenPayload.exp,
          },
          accessToken,
          'ACCESS',
        );

        throw new ForbiddenException(
          'Actividad sospechosa detectada. Inicie sesión nuevamente.',
        );
      }

      const { derivedKey, jti, ...user } = accessTokenPayload;

      req['user'] = user;
      req['derivedKey'] = derivedKey;

      return next();
    } catch (accessTokenError) {
      try {
        // 1. Verificar si hay un refresh token

        if (!refreshToken) {
          throw new UnauthorizedException(
            'Sesión expirada, inicie sesión nuevamente',
          );
        }

        //2. Verificar el refresh token
        const refreshTokenPayload =
          await this.JwtHelper.verifyRefreshToken(refreshToken);

        const { jti, exp, ...newAccessTokenPayload } = refreshTokenPayload;

        //3. Generar un nuevo access token
        const newAccessToken = await this.JwtHelper.generateToken(
          { jti: uuidv4(), ...newAccessTokenPayload },
          '8s', // Duración del nuevo access token
        );

        CookieHelper.clearCookie(res, 'access_token');

        CookieHelper.setCookie(
          res,
          'access_token',
          newAccessToken,
          ACCESS_TOKEN_COOKIE_DURATION,
        );

        // Adjuntar el payload del refresh token a la solicitud
        req['user'] = refreshTokenPayload;
        req['derivedKey'] = refreshTokenPayload.derivedKey;

        // Continuar con la solicitud
        return next();
      } catch (refreshTokenError) {
        await this.JwtHelper.revokedToken(
          decodedRefreshToken,
          refreshToken,
          'REFRESH',
        );

        throw new ForbiddenException(
          'Sesión expirada, inicie sesión nuevamente!! ultimo catch',
        );
      }
    }
  }
}
