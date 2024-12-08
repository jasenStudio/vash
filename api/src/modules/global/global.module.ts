import { Global, Module } from '@nestjs/common';
import { ApiResponseService } from './api-response.service';

@Global()
@Module({
  providers: [ApiResponseService],
  exports: [ApiResponseService],
})
export class GlobalModule {}
