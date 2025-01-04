import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../helpers/helperJwt';

@Injectable()
export class ValidateToken implements NestMiddleware {
  constructor(private JwtHelper: JwtHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;

    const token = this.getToken(authorization);

    try {
      const payload = await this.JwtHelper.verifyToken(token);
      req['user'] = payload;
      req['derivedKey'] = payload.derivedKey;
    } catch (error) {
      throw new ForbiddenException('Token invalido');
    }
    next();
  }

  private getToken(token: string) {
    if (token === undefined)
      throw new UnauthorizedException(
        'Token de autentificacion falta o es invalido ',
      );

    if (token.startsWith('Bearer ')) {
      return token.split(' ')[1];
    }
  }
}
