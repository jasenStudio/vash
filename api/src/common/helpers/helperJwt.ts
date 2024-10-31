import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
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

  async verifyToken(token: string) {
    try {
      const verify = await this.jwtService.verifyAsync(token, {
        secret: this.__config.api_secret,
      });
      return verify;
    } catch (error) {
      throw new ForbiddenException('Token invalido');
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
