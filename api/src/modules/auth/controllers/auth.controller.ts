import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthUserDto, LoginUserDto } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private __authService: AuthService) {}
  @HttpCode(200)
  @Post('sign-in')
  async login(@Body() payload: LoginUserDto) {
    return await this.__authService.login(payload);
  }
  @Post('sign-up')
  async register(@Body() payload: CreateAuthUserDto) {
    return await this.__authService.register(payload);
  }

  @Get('renew')
  async renew(@Req() req: Request) {
    const { iat, exp, ...rest } = req['user'];
    return await this.__authService.renewToken({ ...rest });
  }
}
