import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
@Injectable()
export class RecoveryMethodUpdateAndDeleteOwner implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const subscriptionDetailId = parseInt(request.params.sub_detail_id, 10);
    const methodId = parseInt(request.params.method_id, 10);

    console.log(subscriptionDetailId, 'subscription detail id');
    console.log(methodId, 'method_id');

    if (isNaN(subscriptionDetailId)) {
      throw new ForbiddenException('Invalid subscription detail ID');
    }

    if (isNaN(methodId)) {
      throw new ForbiddenException('Invalid recovery method ID');
    }

    const subscription_detail_db =
      await this.prisma.subscription_detail.findFirst({
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

    const method_recovery_db = await this.prisma.recovery_methods.findFirst({
      where: {
        id: methodId,
        subscription_detail_id: subscriptionDetailId,
        subscription_detail: {
          subscription: {
            accounts: {
              user_id: user.id,
            },
          },
        },
      },
      include: {
        subscription_detail: {
          include: {
            subscription: {
              include: { accounts: { select: { user_id: true } } },
            },
          },
        },
      },
    });

    if (!method_recovery_db) {
      throw new ForbiddenException('Method Recovery not found');
    }

    if (
      method_recovery_db.subscription_detail.subscription.accounts.user_id !==
      user.id
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this method_recovery',
      );
    }

    return true;
  }
}
