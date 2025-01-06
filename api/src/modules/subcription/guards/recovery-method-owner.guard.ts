import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { accounts } from '../../../seed/data-seed';

@Injectable()
export class RecoveryMethodOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const subscriptionDetailId = parseInt(request.params.sub_detail_id, 10);

    if (isNaN(subscriptionDetailId)) {
      throw new ForbiddenException('Invalid subscription detail ID');
    }

    const subscription_detail_db =
      await this.prisma.subscription_detail.findFirst({
        where: {
          id: subscriptionDetailId,
          subscription: { accounts: { user_id: user.id } },
        },

        include: {
          subscription: {
            include: { accounts: { select: { user_id: true } } },
          },
        },
      });

    if (!subscription_detail_db) {
      throw new ForbiddenException(
        'Subscription detail not found for the specified recovery method',
      );
    }

    if (subscription_detail_db.subscription.accounts.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to access this subscription details',
      );
    }

    return true;
  }
}
