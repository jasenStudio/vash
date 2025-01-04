import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ReqUserToken } from '../../auth/dto/auth.dto';
import { HelperEncryptData } from '../../../common/helpers/helperEncrypteData';
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
  constructor(
    private readonly prisma: PrismaService,
    private helperEncryptData: HelperEncryptData,
  ) {}

  async allMethodRecovery(user: ReqUserToken, subscription_detail_id: number) {
    const methods = await this.prisma.recovery_methods.findMany({
      where: {
        subscription_detail_id: subscription_detail_id,
        subscription_detail: {
          subscription: { accounts: { user_id: +user.id } },
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
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    sub_detail_id: number,
    methodRecoveryPayload: CreateMethodRecoveryDto,
  ) {
    const subscription_detail_db_exists =
      await this.prisma.subscription_detail.findUnique({
        where: {
          id: sub_detail_id,
          subscription: {
            accounts: {
              user_id: +user.id,
            },
          },
        },
      });

    if (!subscription_detail_db_exists)
      return {
        message: 'intentado crear un metodo de recuparacion sin permiso',
      };

    const { method_type, method_value } = methodRecoveryPayload;
    const { encryptedData, iv, tag } =
      this.helperEncryptData.encryptDataRecoveryMethod(
        method_value,
        deriveMasterKey,
      );

    console.log(sub_detail_id, 'id detalle subscripcion');
    console.log(encryptedData, 'recovery_methods - encryptedData');

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      const method_recovery_db = await this.prisma.recovery_methods.create({
        data: {
          subscription_detail_id: subscription_detail_db_exists.id,
          method_value: encryptedData,
          method_type: method_type,
        },
      });
      const encrypted_data = await this.prisma.encryptedField.create({
        data: {
          record_id: method_recovery_db.id,
          field_name: 'method_type',
          table_name: 'recovery_methods',
          iv: 'iv',
          tag: 'tag',
        },
      });

      return { method_recovery: method_recovery_db };
    });

    return {
      ok: true,
      methodRecovery: prismaTx.method_recovery,
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
        subscription_detail: {
          subscription: { accounts: { user_id: +user.id } },
        },
      },
      include: {
        subscription_detail: true,
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
        subscription_detail: {
          subscription: { accounts: { user_id: +user.id } },
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
