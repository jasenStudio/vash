import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ReqUserToken } from '../../auth/dto/auth.dto';

import { HelperEncryptData } from '../../../common/helpers/helperEncrypteData';
import { ApiResponseService } from 'src/modules/global/api-response.service';

@Injectable()
export class SubcriptionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private HelperEncryptData: HelperEncryptData,
    private ApiResponseService: ApiResponseService,
  ) {}

  async createSubcriptionAndDetail(
    derivedMasterKey: Buffer,
    subcriptionPayload: CreateSubcriptionDto,
  ) {
    const { subscriptionDetail: subcriptionDetailPayload, ...rest } =
      subcriptionPayload;

    const subscriptionData = rest;

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      let subscription: any;
      let subscription_detail: any;

      subscription = await this.prisma.subscription.create({
        data: subscriptionData,
        select: {
          id: true,
          user_name_subscription: true,
          services_id: true,
          account_id: true,
          status: true,
        },
      });

      const { password, ...details } = subcriptionDetailPayload;

      const { encryptedData, encryptedFields } =
        this.HelperEncryptData.encryptDataSubcriptionDetail(
          { password },
          derivedMasterKey,
        );

      console.log(encryptedData, 'aqio');

      subscription_detail = await this.prisma.subscription_detail.create({
        data: {
          subscription_id: subscription.id,
          password: this.validate_data(encryptedData.password),
          ...details,
          EncryptedField:
            encryptedFields.length > 0
              ? { create: encryptedFields }
              : undefined,
        },
        select: {
          id: true,
          password: true,
          connect_google: true,
          connect_github: true,
          connect_microsoft: true,
          other_connect: true,
          comment: true,
          status: true,
          updated_at: true,
        },
      });

      return {
        subcription: subscription,
        subcription_detail: subscription_detail,
      };
    });

    return this.ApiResponseService.success(
      {
        subscription: {
          ...prismaTx.subcription,
          subcription_detail: prismaTx.subcription_detail,
        },
      },
      'subcription created sucessfully.',
    );
  }

  async allSubcriptions(derivedMasterKey: Buffer, user: ReqUserToken) {
    console.log(derivedMasterKey, 'derivedMasterKey');
    const subscriptions = await this.prisma.subscription.findMany({
      select: {
        id: true,
        user_name_subscription: true,
        services_id: true,
        account_id: true,
        status: true,
        subscription_detail: {
          select: {
            id: true,
            password: true,
            connect_google: true,
            connect_github: true,
            connect_microsoft: true,
            other_connect: true,
            comment: true,
            status: true,
            updated_at: true,
            EncryptedField: {
              select: {
                field_name: true,
                iv: true,
                tag: true,
              },
            },
          },
        },
      },
      where: {
        accounts: {
          user_id: Number(user.id),
        },
      },
    });

    subscriptions.map((sub) => {
      if (sub.subscription_detail.EncryptedField.length > 0) {
        sub.subscription_detail.password = this.HelperEncryptData.decryptData(
          {
            data: sub.subscription_detail.password,
            iv: sub.subscription_detail.EncryptedField[0].iv,
            tag: sub.subscription_detail.EncryptedField[0].tag,
          },
          Buffer.from(derivedMasterKey),
        );
      }
    });

    if (subscriptions.length == 0) {
      return {
        ok: false,
        msg: 'No hay subcripciones creadas con este usuario',
      };
    }

    return this.ApiResponseService.success(
      { subscriptions },
      'Subscription list loaded successfully.',
    );
  }

  async findSubcriptionById(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    subscription_id: number,
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscription_id,
        accounts: {
          user_id: Number(user.id),
        },
      },
      select: {
        id: true,
        user_name_subscription: true,
        services_id: true,
        account_id: true,
        status: true,
        subscription_detail: {
          select: {
            id: true,
            password: true,
            connect_google: true,
            connect_github: true,
            connect_microsoft: true,
            other_connect: true,
            comment: true,
            status: true,
            updated_at: true,
            EncryptedField: {
              select: {
                field_name: true,
                iv: true,
                tag: true,
              },
            },
          },
        },
        accounts: {
          select: {
            user_id: true,
          },
        },
      },
    });

    const { accounts, ...rest } = subscription;

    if (
      subscription.subscription_detail.password &&
      subscription.subscription_detail.EncryptedField.length > 0
    ) {
      subscription.subscription_detail.password =
        this.HelperEncryptData.decryptData(
          {
            data: subscription.subscription_detail.password,
            iv: subscription.subscription_detail.EncryptedField[0].iv,
            tag: subscription.subscription_detail.EncryptedField[0].tag,
          },
          deriveMasterKey,
        );
    }

    const { subscription_detail, ...subscription_db } = rest;
    const { EncryptedField, ...subscription_detail_db } = subscription_detail;

    return this.ApiResponseService.success(
      {
        subscription: {
          ...subscription_db,
          subscription_detail: subscription_detail_db,
        },
      },
      'Subscription load successfully',
    );
  }

  async updateSubcriptionById(
    user: ReqUserToken,
    subcription_id: number,
    subcriptionPayload: UpdateSubcriptionDto,
  ) {
    const updateSubcription = await this.prisma.subscription.update({
      where: { id: subcription_id, accounts: { user_id: Number(user.id) } },
      data: subcriptionPayload,
    });

    return this.ApiResponseService.success(
      { subscription: updateSubcription },
      'Subscription updated successfully',
    );
  }

  async updateSubcriptionDetail(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    subscription_id: number,
    subscription_detail_id: number,
    subscription_detail_payload: UpdateSubcriptionDetailDto,
  ) {
    const { password, ...details } = subscription_detail_payload;

    const { encryptedData, encryptedFields } =
      this.HelperEncryptData.encryptDataSubcriptionDetail(
        { password },
        deriveMasterKey,
      );

    const prismaTx = await this.prisma.$transaction(async (tx) => {
      let subscription_detail_db: any;

      subscription_detail_db = await this.prisma.subscription_detail.update({
        where: {
          subscription_id: subscription_id,
          id: subscription_detail_id,
          subscription: {
            accounts: {
              user_id: Number(user.id),
            },
          },
        },
        data: {
          password: this.validate_data(encryptedData.password),
          ...details,
        },
        select: {
          id: true,
          password: true,
          subscription_id: true,
          connect_github: true,
          connect_google: true,
          connect_microsoft: true,
          other_connect: true,
          comment: true,
          status: true,
          updated_at: true,
          EncryptedField: {
            where: {
              record_id: +subscription_detail_id,
            },
          },
        },
      });

      const encryptedFieldExists = await this.prisma.encryptedField.findFirst({
        where: {
          record_id: +subscription_detail_db.id,
          table_name: 'subscription_details',
          field_name: 'password',
        },
      });

      if (
        encryptedFieldExists &&
        this.validate_data(encryptedData.password) === null
      ) {
        await this.prisma.encryptedField.delete({
          where: {
            id: encryptedFieldExists.id,
          },
        });
      }

      if (subscription_detail_db.password !== null) {
        if (encryptedFieldExists) {
          await this.prisma.encryptedField.update({
            where: {
              id: encryptedFieldExists.id,
            },
            data: {
              iv: encryptedFields[0].iv,
              tag: encryptedFields[0].tag,
            },
          });
        } else {
          await this.prisma.encryptedField.create({
            data: {
              iv: encryptedFields[0].iv,
              tag: encryptedFields[0].tag,
              record_id: +subscription_detail_db.id,
              field_name: 'password',
              table_name: 'subscription_details',
            },
          });
        }
      }

      const { EncryptedField, _password, ...subscription_detail } =
        subscription_detail_db;

      return {
        subscription_detail: {
          ...subscription_detail,
          password: this.validate_data(password),
        },
      };
    });

    return this.ApiResponseService.success(
      { subscription_detail: prismaTx.subscription_detail },
      'Subscription detail updated successfully',
    );
  }

  async deleteSubcription(user: ReqUserToken, subcription_id: number) {
    const deleteSubcription = await this.prisma.subscription.delete({
      where: { id: subcription_id, accounts: { user_id: Number(user.id) } },
    });

    return this.ApiResponseService.success(
      { subscription: deleteSubcription },
      'Subscription deleted successfully',
    );
  }

  private validate_data(data: string): string | null {
    return data ? data : null;
  }
}
