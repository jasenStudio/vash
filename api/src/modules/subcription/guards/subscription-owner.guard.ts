import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class SubscriptionOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const subscriptionId = parseInt(request.params.id, 10);

    if (isNaN(subscriptionId)) {
      throw new ForbiddenException('Invalid subscription ID');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, accounts: { user_id: request.user.id } },

      include: { accounts: { select: { user_id: true } } },
    });

    if (!subscription) {
      throw new ForbiddenException('subscription not found');
    }

    if (subscription.accounts.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to access this account',
      );
    }

    return true;
  }
}
