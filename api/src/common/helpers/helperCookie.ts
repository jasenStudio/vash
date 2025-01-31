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
      sameSite: 'strict',
      maxAge: duration,
    });
  }

  public static clearCookie(response: Response, nameCookie: string) {
    response.clearCookie(nameCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod' || true,
      sameSite: 'strict',
    });
  }
}
