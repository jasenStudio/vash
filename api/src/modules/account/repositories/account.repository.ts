import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ReqUserToken } from 'src/modules/auth/dto/auth.dto';
import { AccountCreateDto, AccountUpdateDto } from '../dto/account.dto';
import { ApiResponseService } from 'src/modules/global/api-response.service';
import { AccountResponse, AccountsResponse } from '../entities/account.entity';
@Injectable()
export class AccountRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly __apiResponseService: ApiResponseService,
  ) {}
  async findAll(user: ReqUserToken): Promise<AccountsResponse> {
    const accounts = await this.prisma.account.findMany({
      where: {
        user_id: +user.id,
      },
    });

    return this.__apiResponseService.success(
      { accounts: accounts },
      'Listado de cuentas',
    );
  }

  async create(
    user: ReqUserToken,
    accountPayload: AccountCreateDto,
  ): Promise<AccountResponse> {
    const account = await this.prisma.account.create({
      data: {
        ...accountPayload,
        user_id: +user.id,
      },
    });

    return this.__apiResponseService.success(
      { account: account },
      'Account created successfully',
    );
  }

  async update(
    user: ReqUserToken,
    id: number,
    accountPayload: AccountUpdateDto,
  ): Promise<AccountResponse> {
    const account = await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        ...accountPayload,
        user_id: +user.id,
      },
    });

    return this.__apiResponseService.success(
      { account: account },
      'Account updated successfully',
    );
  }

  async delete(user: ReqUserToken, id: number) {
    const account = await this.prisma.account.delete({
      where: {
        id,
        user_id: +user.id,
      },
    });

    return this.__apiResponseService.success(
      { account: account },
      'Account deleted successfully',
    );
  }
}
