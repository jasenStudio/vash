import { Injectable } from '@nestjs/common';
import { CategoriesServiceRepository } from '../repositories';
@Injectable()
export class CategoriesService {
  constructor(
    private readonly categorieServiceRepository: CategoriesServiceRepository,
  ) {}

  async findAllCategoriesService() {
    return await this.categorieServiceRepository.findAll();
  }
}
