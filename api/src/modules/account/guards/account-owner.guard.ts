import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class AccountOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const accountId = parseInt(request.params.id, 10);

    if (isNaN(accountId)) {
      throw new ForbiddenException('Invalid account ID');
    }

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new ForbiddenException('Account not found');
    }

    if (account.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to access this account',
      );
    }

    return true;
  }
}
