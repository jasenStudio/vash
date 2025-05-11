import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountRepository } from './repositories/account.repository';

@Module({
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  imports: [PrismaModule],
  exports: [],
})
export class AccountModule {}
