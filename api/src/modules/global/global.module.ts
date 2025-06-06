import { Global, Module } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [ApiResponseService],
  exports: [ApiResponseService, PrismaModule],
})
export class GlobalModule {}
