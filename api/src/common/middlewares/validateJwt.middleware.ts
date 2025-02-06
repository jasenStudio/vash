import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../helpers/helperJwt';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { optimizedDataUserAgent } from '../decorators/user-agent/user-agent';
import { v4 as uuidv4 } from 'uuid';
import { CookieHelper } from '../helpers/helperCookie';
import {
  ACCESS_TOKEN_COOKIE_DURATION,
  ACCESS_TOKEN_DURATION,
  errors,
} from '../constants';
import * as bcrypt from 'bcrypt';

interface dataTokens {
  res: Response;
  accessToken: string;
  refreshToken: string;
  decodedRefreshToken: any; //TODO Pendiente por tipar
  accessTokenPayloadVerified: any;
  storedRefreshToken: any;
}

@Injectable()
export class ValidateToken implements NestMiddleware {
  constructor(
    private JwtHelper: JwtHelper,
    private prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    const userAgent = req.headers['user-agent'];
    const device = req.headers['x-device-info']
      ? (req.headers['x-device-info'] as string)
      : 'Desktop';
    const decodedRefreshToken = this.JwtHelper.decodeToken(refreshToken);
    const decodedAccessToken = this.JwtHelper.decodeToken(accessToken);

    const userAgentCurrent = optimizedDataUserAgent(userAgent, device);
    console.log('🚀 ~ ValidateToken ~ use ~ path:', req.path);

    if (req.path === '/api/auth/renew') {
      return next();
    }

    try {
      const { user, derivedKey } = await this.JwtHelper.verifyAccessTokens(
        res,
        accessToken,
        refreshToken,
        decodedRefreshToken,
        userAgentCurrent,
      );

      req['user'] = user;
      req['derivedKey'] = derivedKey;

      return next();
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
            storedRefreshToken: decodedRefreshToken,
            decodedRefreshToken,
            accessTokenPayloadVerified: this.JwtHelper.decodeToken(accessToken),
          });
        }

        const { refreshTokenPayload } =
          await this.JwtHelper.verifyRefreshTokens(res, refreshToken);

        req['user'] = refreshTokenPayload;
        req['derivedKey'] = refreshTokenPayload.derivedKey;

        return next();
      } catch (refreshTokenError) {
        if (decodedAccessToken) {
          await this.JwtHelper.revokedToken(
            decodedAccessToken,
            accessToken,
            'ACCESS',
          );
        }

        if (decodedRefreshToken) {
          await this.prisma.refreshToken.deleteMany({
            where: decodedRefreshToken.jti,
          });

          await this.JwtHelper.revokedToken(
            decodedRefreshToken,
            refreshToken,
            'REFRESH',
          );
        }
        CookieHelper.clearSessionCookies(res);
        throw new UnauthorizedException(errors.auth.session.expired);
      }
    }
  }
}
