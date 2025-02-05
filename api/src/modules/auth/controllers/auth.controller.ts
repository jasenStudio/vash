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
    console.log('entra en renew');
    const refreshToken = req.cookies['refresh_token'];
    const accessToken = req.cookies['access_token'];
    const userAgent = req.headers['user-agent'];
    const device = req.headers['x-device-info']
      ? (req.headers['x-device-info'] as string)
      : 'Desktop';

    const result = await this.__authService.renewToken(
      res,
      accessToken,
      refreshToken,
      userAgent,
      device,
    );

    return res.status(200).json({ ...result });
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
      const result = await this.__authService.logout(accessToken, refreshToken);

      CookieHelper.clearCookie(res, 'access_token');
      CookieHelper.clearCookie(res, 'refresh_token');

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
