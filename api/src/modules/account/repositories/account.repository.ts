import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ReqUserToken } from 'src/modules/auth/dto/auth.dto';
import {
  AccountCreateDto,
  AccountUpdateDto,
  QueryListAccount,
} from '../dto/account.dto';
import { ApiResponseService } from 'src/modules/global/api-response.service';
import { AccountResponse, AccountsResponse } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly __apiResponseService: ApiResponseService,
  ) {}
  async findAll(
    user: ReqUserToken,
    query: QueryListAccount,
  ): Promise<AccountsResponse> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query['search'] || '';
    const skip = (page - 1) * limit;

    const accounts = await this.prisma.account.findMany({
      where: {
        user_id: +user.id,
        account_email: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: {
        account_email: 'desc', // Ordenar por correo en orden descendente
      },
    });

    const total = await this.prisma.account.count({
      where: {
        user_id: +user.id,
        account_email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return this.__apiResponseService.success(
      { accounts },
      'Listado de cuentas',
      {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
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
        id: id,
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
