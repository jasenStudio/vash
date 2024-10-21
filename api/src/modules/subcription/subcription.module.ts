import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubcriptionService, MethodsRecoveryService } from './services';
import {
  SubcriptionRepository,
  MethodRecoveryRepository,
} from './repositories';
import {
  MethodsRecoveryController,
  SubcriptionController,
} from './controllers';

@Module({
  imports: [PrismaModule],
  providers: [
    SubcriptionService,
    SubcriptionRepository,
    MethodRecoveryRepository,
    MethodsRecoveryService,
  ],
  controllers: [SubcriptionController, MethodsRecoveryController],
  exports: [
    //* Services
    SubcriptionService,
    MethodsRecoveryService,

    //* Repository
    SubcriptionRepository,
    MethodRecoveryRepository,
  ],
})
export class SubcriptionModule {}
