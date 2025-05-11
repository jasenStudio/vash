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
import { HelperEncryptData } from 'src/common/helpers/helperEncrypteData';
import { cryptoHelper } from 'src/common/helpers/helperCrypto';

@Module({
  imports: [PrismaModule],
  providers: [
    SubcriptionService,
    SubcriptionRepository,
    MethodRecoveryRepository,
    MethodsRecoveryService,
    HelperEncryptData,
    cryptoHelper,
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
