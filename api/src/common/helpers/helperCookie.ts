import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CookieHelper {
  public static setCookie(
    response: Response,
    nameCookie: string,
    token: string,
    duration: number,
  ) {
    response.cookie(nameCookie, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod' || true,
      sameSite: 'none',
      maxAge: duration,
    });
  }

  public static clearCookie(response: Response, nameCookie: string) {
    response.clearCookie(nameCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod' || true,
      sameSite: 'none',
    });
  }

  public static clearSessionCookies(res: Response) {
    CookieHelper.clearCookie(res, 'access_token');
    CookieHelper.clearCookie(res, 'refresh_token');
  }

  public static ClearSessionCookiesTokens(res: Response) {
    CookieHelper.clearCookie(res, 'access_token');
    CookieHelper.clearCookie(res, 'refresh_token');
    CookieHelper.clearCookie(res, 'csrf-token');
  }
}
