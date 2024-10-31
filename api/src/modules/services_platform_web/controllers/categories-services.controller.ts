import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories-services')
@Controller('categories-services')
export class CategoriesServicesController {
  constructor(private __categoriesService: CategoriesService) {}
  @Get()
  async findAll() {
    return await this.__categoriesService.findAllCategoriesService();
  }
}
