import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
