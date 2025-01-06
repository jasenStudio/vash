import { Injectable } from '@nestjs/common';

import { HelperEncryptData } from '../../../common/helpers/helperEncrypteData';

//* DTO
import {
  CreateMethodRecoveryDto,
  UpdateMethodRecoveryDto,
} from '../dto/method-recovery.dto';
import { ReqUserToken } from '../../auth/dto/auth.dto';

//* Services
import { PrismaService } from '../../prisma/services/prisma.service';
import { ApiResponseService } from '../../global/api-response.service';

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
    private apiResponseService: ApiResponseService,
  ) {}

  async allMethodRecovery(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    subscription_detail_id: number,
  ) {
    const methods = await this.prisma.recovery_methods.findMany({
      where: {
        subscription_detail_id: subscription_detail_id,
        subscription_detail: {
          subscription: { accounts: { user_id: +user.id } },
        },
      },
      include: {
        EncryptedField: {
          select: {
            id: true,
            table_name: true,
            record_id: true,
            record_recovery_id: true,
            field_name: true,
            iv: true,
            tag: true,
          },
        },
      },
    });

    const methods_recovery_decrypted = methods.map((method) => {
      const decrypted = {
        ...method,
        method_value: this.helperEncryptData.decryptData(
          {
            data: method.method_value,
            iv: method.EncryptedField[0].iv,
            tag: method.EncryptedField[0].tag,
          },
          deriveMasterKey,
        ),
      };

      const { EncryptedField, ...method_recovery } = decrypted;

      return method_recovery;
    });

    return this.apiResponseService.success(
      { methods_recovery: methods_recovery_decrypted },
      'Recovery methods loaded successfully',
    );
  }

  async createMethodRecovery(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    sub_detail_id: number,
    methodRecoveryPayload: CreateMethodRecoveryDto,
  ) {
    const { method_type, method_value } = methodRecoveryPayload;
    const { encryptedData, iv, tag } =
      this.helperEncryptData.encryptDataRecoveryMethod(
        method_value,
        deriveMasterKey,
      );

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      const method_recovery_db = await this.prisma.recovery_methods.create({
        data: {
          subscription_detail_id: sub_detail_id,
          method_value: encryptedData,
          method_type: method_type,
        },
      });

      await this.prisma.encryptedField.create({
        data: {
          record_recovery_id: method_recovery_db.id,
          field_name: 'method_type',
          table_name: 'recovery_methods',
          iv: iv,
          tag: tag,
        },
      });

      return { method_recovery: method_recovery_db };
    });

    const { method_value: method_value_encrypted, ...rest } =
      prismaTx.method_recovery;

    return this.apiResponseService.success(
      {
        method_recovery: { method_value: method_value, ...rest },
      },
      'The recovery method was successfully created',
    );
  }

  async updateMethodById(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
    methodRecoveryPayload: UpdateMethodRecoveryDto,
  ) {
    const { method_value, method_type, ...payload } = methodRecoveryPayload;

    const { encryptedData, iv, tag } =
      this.helperEncryptData.encryptDataRecoveryMethod(
        method_value,
        deriveMasterKey,
      );

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      let method_recovery_db: any;

      method_recovery_db = await this.prisma.recovery_methods.update({
        where: {
          id: method_id,
          subscription_detail_id: sub_detail_id,
          subscription_detail: {
            subscription: { accounts: { user_id: +user.id } },
          },
        },
        data: {
          method_value: encryptedData,
          method_type: method_type,
          ...payload,
        },
      });

      const encryptedFieldExists = await this.prisma.encryptedField.findFirst({
        where: {
          record_recovery_id: +method_recovery_db.id,
          table_name: 'recovery_methods',
          field_name: 'method_type',
        },
      });

      if (encryptedFieldExists) {
        await this.prisma.encryptedField.update({
          where: {
            id: encryptedFieldExists.id,
          },
          data: {
            table_name: 'recovery_methods',
            field_name: 'method_type',
            iv: iv,
            tag: tag,
          },
        });
      } else {
        await this.prisma.encryptedField.create({
          data: {
            field_name: 'method_type',
            iv: iv,
            record_recovery_id: +method_recovery_db.id,
            table_name: 'recovery_methods',
            tag: tag,
          },
        });
      }

      const { method_value: method_value_db, ...rest_method_recovery } =
        method_recovery_db;

      return {
        method_recovery: {
          method_value: method_value,
          ...rest_method_recovery,
        },
      };
    });

    return this.apiResponseService.success(
      { method_recovery: prismaTx.method_recovery },
      'The recovery method was successfully updated.',
    );
  }

  async deleteMethodRecovery(
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
  ) {
    const deleteRecoveryMethod = await this.prisma.recovery_methods.delete({
      where: {
        id: method_id,
        subscription_detail_id: sub_detail_id,
        subscription_detail: {
          subscription: { accounts: { user_id: +user.id } },
        },
      },
    });

    return this.apiResponseService.success(
      { method_recovery: deleteRecoveryMethod },
      'the recovery method was deleted successfully',
    );
  }

  private validate_data(data: string): string | null {
    return data ? data : null;
  }
}
