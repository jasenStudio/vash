import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.account.findMany();
  }
}
