import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class SubscriptionDetailOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const subscriptionId = parseInt(request.params.id, 10);
    const subscriptionDetailId = parseInt(
      request.params.subcription_detail_id,
      10,
    );

    console.log(subscriptionId, subscriptionDetailId);
    if (isNaN(subscriptionId)) {
      throw new ForbiddenException('Invalid subscription ID');
    }

    if (isNaN(subscriptionDetailId)) {
      throw new ForbiddenException('Invalid subscription detail ID');
    }

    const subscriptionDetail = await this.prisma.subscription_detail.findFirst({
      where: { id: subscriptionDetailId },
      include: {
        subscription: {
          select: {
            id: true,
            accounts: {
              select: {
                user_id: true,
              },
            },
          },
        },
      },
    });
    console.log(subscriptionDetail);
    if (!subscriptionDetail) {
      throw new ForbiddenException('subscription details not found');
    }

    if (subscriptionDetail.subscription.id !== subscriptionId) {
      throw new ForbiddenException(
        'You are not authorized to access this subscription',
      );
    }

    if (subscriptionDetail.subscription.accounts.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to access this subscriptionDetails',
      );
    }

    return true;
  }
}
