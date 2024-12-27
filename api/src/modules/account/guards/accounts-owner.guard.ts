import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class AccountsOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const accountIds = request.body.ids;

    console.log(accountIds);
    if (!Array.isArray(accountIds)) {
      throw new ForbiddenException('Invalid account IDs');
    }

    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: accountIds },
        user_id: user.id,
      },
    });

    if (accounts.length === 0) {
      throw new NotFoundException('No accounts found');
    }

    console.log(accounts.length);
    if (accounts.length !== accountIds.length) {
      throw new ForbiddenException(
        'Una o más cuentas no pertenecen al usuario',
      );
    }

    console.log(accounts.length !== accountIds.length);

    return true;
  }
}
