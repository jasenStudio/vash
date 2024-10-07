import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import config from '../../config/configuration';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(config.KEY)
    private __config: ConfigType<typeof config>,
  ) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.__config.api_secret,
      });
    } catch (error) {
      console.log(error);
      throw new Error('Token inválido');
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
