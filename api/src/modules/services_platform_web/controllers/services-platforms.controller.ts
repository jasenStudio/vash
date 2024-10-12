import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicePlatformService } from '../services/service-platform.service';

@ApiTags('services-platform-web')
@Controller('services')
export class ServicePlatformsController {
  constructor(
    private readonly __servicePlatformService: ServicePlatformService,
  ) {}

  @Get('')
  async findAll() {
    return await this.__servicePlatformService.findAllServices();
  }
}
