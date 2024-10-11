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
    const authorization = req.header('authorization');
    const token = this.getToken(authorization);
    if (!token) {
      throw new UnauthorizedException(
        'Token de autentificacion falta o es invalido ',
      );
    }
    try {
      const payload = await this.JwtHelper.verifyToken(token);
      req['user'] = payload;
    } catch (error) {
      throw new ForbiddenException('Token invalido');
    }
    next();
  }

  private getToken(token: string) {
    return token.length > 0 && token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : null;
  }
}
