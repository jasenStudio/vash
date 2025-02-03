import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthUserDto, LoginUserDto } from '../dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserAgent } from 'src/common/decorators/user-agent/user-agent';
import { JwtHelper } from '../../../common/helpers/helperJwt';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CookieHelper } from 'src/common/helpers/helperCookie';
import {
  ACCESS_TOKEN_COOKIE_DURATION,
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_COOKIE_DURATION,
} from 'src/common/constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private __authService: AuthService,
    private JwtHelper: JwtHelper,
  ) {}

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
  async login(
    @Body() payload: LoginUserDto,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.__authService.login(payload, userAgent);

    const { refreshToken, token: newAccessToken } = result;

    CookieHelper.clearCookie(res, 'access_token');
    CookieHelper.clearCookie(res, 'refresh_token');

    CookieHelper.setCookie(
      res,
      'access_token',
      newAccessToken,
      ACCESS_TOKEN_COOKIE_DURATION,
    );

    CookieHelper.setCookie(
      res,
      'refresh_token',
      refreshToken,
      REFRESH_TOKEN_COOKIE_DURATION,
    );

    delete result.refreshToken;
    delete result.token;

    return res.status(200).json(result);
  }
  @Post('sign-up')
  async register(@Body() payload: CreateAuthUserDto) {
    return await this.__authService.register(payload);
  }

  @Get('renew')
  async renew(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const accessToken = req.cookies['access_token'];

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const decodedAccessTokenCurrent = this.JwtHelper.decodeToken(accessToken);
    const decodeRefreshTokenCurrent = this.JwtHelper.decodeToken(refreshToken);

    try {
      // 1️⃣ Verificar y decodificar el refresh token
      const payload = await this.JwtHelper.verifyRefreshToken(refreshToken);

      const { jti, exp, derivedKey, ...newAccessTokenPayload } = payload;

      // 2️⃣ Generar un nuevo access token
      const newAccessToken = await this.JwtHelper.generateToken(
        { jti: uuidv4(), ...newAccessTokenPayload, derivedKey },
        ACCESS_TOKEN_DURATION,
      );

      await this.JwtHelper.revokedToken(
        decodedAccessTokenCurrent,
        accessToken,
        'ACCESS',
      );

      // 4️⃣ Limpiar cookies antiguas
      CookieHelper.clearCookie(res, 'access_token');

      // 5️⃣ Configurar las nuevas cookies
      CookieHelper.setCookie(
        res,
        'access_token',
        newAccessToken,
        ACCESS_TOKEN_COOKIE_DURATION,
      );

      return res.status(200).json({
        ok: true,
        message: 'Tokens renovados exitosamente',
        data: {
          user: newAccessTokenPayload,
        },
      });
    } catch (error) {
      console.error('Error en /renew:', error);

      await this.JwtHelper.revokedToken(
        decodedAccessTokenCurrent,
        accessToken,
        'ACCESS',
      );

      await this.JwtHelper.revokedToken(
        decodeRefreshTokenCurrent,
        refreshToken,
        'REFRESH',
      );

      CookieHelper.clearCookie(res, 'access_token');
      CookieHelper.clearCookie(res, 'refresh_token');

      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    let accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];

    if (!accessToken) {
      accessToken = '';
    }

    if (!refreshToken) {
      return res.status(400).json({ message: 'Tokens no proporcionados' });
    }
    try {
      // Llamar al servicio de autenticación para cerrar la sesión
      const result = await this.__authService.logout(accessToken, refreshToken);

      // Eliminar las cookies del cliente
      CookieHelper.clearCookie(res, 'access_token');
      CookieHelper.clearCookie(res, 'refresh_token');

      // Enviar una respuesta de éxito
      return res.status(200).json({ ok: true, message: result.message });
    } catch (error) {
      // Manejar errores
      return res.status(500).json({
        ok: false,
        message: 'Error al cerrar la sesión',
        error: { code: 500 },
      });
    }
  }
}
