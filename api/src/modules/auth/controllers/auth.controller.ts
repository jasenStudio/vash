import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthUserDto, LoginUserDto } from '../dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private __authService: AuthService) {}

  @ApiOperation({
    summary: 'Iniciar sesion con un usuario',
    description:
      'Para iniciar sesion debe ingresar un usuario o correo electronico con su respectiva contraseña',
  })
  @ApiResponse({ status: 200, description: 'Usuario loggeado' })
  @ApiResponse({ status: 400, description: 'Credenciales' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Parametros para inicio de sesión',
  })
  @HttpCode(HttpStatus.OK)
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
