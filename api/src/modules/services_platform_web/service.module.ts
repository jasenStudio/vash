import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import {
  CategoriesServicesController,
  ServicePlatformsController,
} from './controllers';

import { CategoriesServiceRepository, ServiceRepository } from './repositories';
import { CategoriesService, ServicePlatformService } from './services';
@Module({
  controllers: [ServicePlatformsController, CategoriesServicesController],
  imports: [PrismaModule],
  providers: [
    ServicePlatformService,
    ServiceRepository,
    CategoriesServiceRepository,
    CategoriesService,
  ],
  exports: [ServicePlatformService, CategoriesService],
})
export class ServiceModule {}
