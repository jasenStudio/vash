import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../repositories/services-platform.repository';
@Injectable()
export class ServicePlatformService {
  constructor(private readonly __serviceRepository: ServiceRepository) {}
  async findAllServices() {
    return await this.__serviceRepository.findAll();
  }
}
