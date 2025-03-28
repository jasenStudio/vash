import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  Res,
  NotFoundException,
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
import { doubleCsrf } from 'csrf-csrf';

const { generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod' || true,
    sameSite: 'none',
  },
});
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
    @Req() req: Request,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.__authService.login(payload, userAgent);

    const { refreshToken, token: newAccessToken } = result;

    CookieHelper.clearCookie(res, 'access_token');
    CookieHelper.clearCookie(res, 'refresh_token');
    CookieHelper.clearCookie(res, 'csrf-token');

    const csrfToken = generateToken(req, res, true);

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

    try {
      if (!accessToken) {
        accessToken = '';
      }
      if (!refreshToken) {
        CookieHelper.ClearSessionCookiesTokens(res);
        throw new NotFoundException({
          error: 'not_found_tokens',
          message: 'Tokens no proporcionados',
        });
      }
      const result = await this.__authService.logout(accessToken, refreshToken);

      CookieHelper.ClearSessionCookiesTokens(res);

      return res.status(200).json({ ok: true, message: result.message });
    } catch (error) {
      // Manejar errores
      if (error.response.error === 'not_found_tokens') {
        throw error;
      }
      return res.status(500).json({
        ok: false,
        message: 'Error al cerrar la sesión',
        error: { code: 500 },
      });
    }
  }

  @Get('token-csrf')
  async tokencsrg(@Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.cookies['csrf-token']);

      const token = generateToken(req, res, true);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error generating CSRF token' });
    }
  }
}
