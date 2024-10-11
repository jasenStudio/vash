import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../../dto/user.dto';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { IsAdminGuard } from '../../../auth/guards/is-admin/is-admin.guard';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly UserService: UserService,
    private readonly prisma: PrismaService,
  ) {}
  @Get('/')
  @UseGuards(IsAdminGuard)
  async getUsers() {
    return this.prisma.user.findMany();
  }

  @Post('/new')
  @UseGuards(IsAdminGuard)
  async createUser(@Body() payload: CreateUserDTO) {
    return await this.UserService.createUser(payload);
  }
}
