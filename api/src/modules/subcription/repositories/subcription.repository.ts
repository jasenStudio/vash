import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ReqUserToken } from '../../auth/dto/auth.dto';
import { isArray } from 'class-validator';

@Injectable()
export class SubcriptionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createSubcriptionAndDetail(subcriptionPayload: CreateSubcriptionDto) {
    const { subcriptionDetail: subcriptionDetailPayload, ...rest } =
      subcriptionPayload;

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      let subcription: any;
      let subcription_detail: any;

      subcription = await this.prisma.subscription.create({
        data: rest,
      });
      console.log(subcription);
      subcription_detail = await this.prisma.subscription_detail.create({
        data: {
          subcription_id: subcription.id,
          ...subcriptionDetailPayload,
        },
      });

      return {
        subcription,
        subcription_detail,
      };
    });

    return {
      ok: true,
      subcription: {
        ...prismaTx.subcription,
        subcription_detail: prismaTx.subcription_detail,
      },
      msg: 'subcripción creada correctamente.',
    };
  }

  async allSubcriptions(user: ReqUserToken) {
    const subcriptions = await this.prisma.subscription.findMany({
      where: {
        accounts: {
          user_id: Number(user.id),
        },
      },
      include: {
        Subscription_detail: true,
      },
    });

    if (subcriptions.length == 0) {
      return {
        ok: false,
        msg: 'No hay subcripciones creadas con este usuario',
      };
    }

    return {
      ok: true,
      subcriptions,
    };
  }

  async findSubcriptionById(user: ReqUserToken, subcription_id: number) {
    const subcription = await this.prisma.subscription.findFirstOrThrow({
      where: {
        id: subcription_id,
        accounts: {
          user_id: Number(user.id),
        },
      },
      include: {
        Subscription_detail: true,
        accounts: { select: { user_id: true } },
      },
    });

    this.validate_permissions_subcriptions(
      +user.id,
      subcription,
      'El usuario no tiene permiso visualizar este subcripción o la subcripcion es inexistente',
    );

    const { accounts, ...rest } = subcription;

    return {
      ok: true,
      subcription: rest,
    };
  }

  async updateSubcriptionById(
    user: ReqUserToken,
    subcription_id: number,
    subcriptionPayload: UpdateSubcriptionDto,
  ) {
    const subcription = await this.prisma.subscription.findFirstOrThrow({
      where: { id: subcription_id },
      include: { accounts: { select: { user_id: true } } },
    });

    this.validate_permissions_subcriptions(
      +user.id,
      subcription,
      'El usuario no tiene permiso para actualizar',
    );

    const updateSubcription = await this.prisma.subscription.update({
      where: { id: subcription_id },
      data: subcriptionPayload,
    });

    return {
      ok: true,
      subcription: updateSubcription,
    };
  }

  async updateSubcriptionDetail(
    user: ReqUserToken,
    id: number,
    subscription_detail_id: number,
    subscription_detail_payload: UpdateSubcriptionDetailDto,
  ) {
    const subscriptionDetail =
      await this.prisma.subscription_detail.findFirstOrThrow({
        where: { id: subscription_detail_id },
        include: {
          subcription: {
            include: {
              accounts: true, // Incluye todas las cuentas relacionadas con la suscripción
            },
          },
        },
      });

    //*TODO RESOLVE ACCOUNTS SELECT
    const userHasAccess = subscriptionDetail.subcription;

    this.validate_permissions_subcriptions(
      +user.id,
      userHasAccess,
      'El usuario no tiene permiso para actualizar el detalle de subcripcion',
    );

    if (id !== subscriptionDetail.subcription_id) {
      throw new UnauthorizedException(
        'El usuario no puede actualizar sin permiso o inexistente',
      );
    }

    const subscription_detail = await this.prisma.subscription_detail.update({
      where: {
        id: subscription_detail_id,
      },
      data: {
        subcription_id: id,
        ...subscription_detail_payload,
      },
    });

    return {
      ok: true,
      subscription_detail,
    };
  }

  async deleteSubcription(user: ReqUserToken, subcription_id: number) {
    const { ok, subcription } = await this.findSubcriptionById(
      user,
      subcription_id,
    );

    if (ok) {
      const deleteSubcription = await this.prisma.subscription.delete({
        where: { id: subcription.id },
      });

      return {
        ok: true,
        subcription: deleteSubcription,
        msg: 'La subcription fue eliminada correctamente',
      };
    }
  }

  private validate_permissions_subcriptions(
    user_id: number,
    data: any,
    message: string,
  ) {
    if (user_id !== data.accounts.user_id) {
      throw new UnauthorizedException(message);
    }
  }
}
