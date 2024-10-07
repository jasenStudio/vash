import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDTO } from '../dto/user.dto';
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByTerm(search: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { OR: [{ email: search }, { user_name: search }] },
    });
  }

  async createUser(userPayload: CreateUserDTO) {
    const saltOrRounds = 10;
    const { password, ...rest } = userPayload;
    const password_hash = await bcrypt.hash(password, saltOrRounds);
    return await this.prisma.user.create({
      data: { ...rest, password: password_hash },
    });
  }
}
