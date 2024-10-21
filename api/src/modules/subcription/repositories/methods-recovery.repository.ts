import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ReqUserToken } from '../../auth/dto/auth.dto';
import {
  CreateMethodRecoveryDto,
  UpdateMethodRecoveryDto,
} from '../dto/method-recovery.dto';

type methods =
  | 'password_recovery'
  | 'email_recovery'
  | 'token_recovery'
  | 'phone_recovery';

@Injectable()
export class MethodRecoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async allMethodRecovery(user: ReqUserToken, subscription_detail_id: number) {
    const methods = await this.prisma.recovery_methods.findMany({
      where: {
        subscription_detail_id: subscription_detail_id,
        subcription_detail: {
          subcription: { accounts: { user_id: +user.id } },
        },
      },
    });

    if (methods.length === 0) {
      return {
        ok: false,
        msg: 'La subcripcion no tiene metodos de recuperación',
      };
    }

    return {
      ok: true,
      methods,
    };
  }

  async createMethodRecovery(
    sub_detail_id: number,
    methodRecoveryPayload: CreateMethodRecoveryDto,
  ) {
    const methodRecovery = await this.prisma.recovery_methods.create({
      data: { ...methodRecoveryPayload, subscription_detail_id: sub_detail_id },
    });

    return {
      ok: true,
      methodRecovery,
    };
  }

  async updateMethodById(
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
    methodRecoveryPayload: UpdateMethodRecoveryDto,
  ) {
    const method = await this.prisma.recovery_methods.findFirstOrThrow({
      where: {
        id: method_id,
        subscription_detail_id: sub_detail_id,
        subcription_detail: {
          subcription: { accounts: { user_id: +user.id } },
        },
      },
      include: {
        subcription_detail: true,
      },
    });

    const updateMethodsRecovery = await this.prisma.recovery_methods.update({
      where: { id: method.id },
      data: methodRecoveryPayload,
    });

    return {
      ok: true,
      method: updateMethodsRecovery,
    };
  }

  async deleteMethodRecovery(
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
  ) {
    const method = await this.prisma.recovery_methods.findFirstOrThrow({
      where: {
        id: method_id,
        subscription_detail_id: sub_detail_id,
        subcription_detail: {
          subcription: { accounts: { user_id: +user.id } },
        },
      },
    });

    const deleteRecoveryMethod = await this.prisma.recovery_methods.delete({
      where: { id: method.id },
    });

    return {
      ok: true,
      method: deleteRecoveryMethod,
      msg: 'El metodo de recuperacion fue eliminado exitosamente',
    };
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
