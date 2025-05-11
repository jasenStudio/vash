import { User } from './../../../../node_modules/.prisma/client/index.d';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);
    const { iat, exp, ...rest } = request.user;

    return rest;
  },
);
