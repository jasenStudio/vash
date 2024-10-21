import { Injectable } from '@nestjs/common';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { SubcriptionRepository } from '../repositories/subcription.repository';
import { ReqUserToken } from '../../auth/dto/auth.dto';

@Injectable()
export class SubcriptionService {
  constructor(private subcriptionRepository: SubcriptionRepository) {}

  async createSubcription(subcriptionPayload: CreateSubcriptionDto) {
    return await this.subcriptionRepository.createSubcriptionAndDetail(
      subcriptionPayload,
    );
  }

  async findAllSubcriptions(user: ReqUserToken) {
    return await this.subcriptionRepository.allSubcriptions(user);
  }

  async findSubcriptionById(user: ReqUserToken, id: number) {
    return await this.subcriptionRepository.findSubcriptionById(user, id);
  }

  async updateSubcription(
    user: ReqUserToken,
    subcription_id: number,
    subcriptionPayload: UpdateSubcriptionDto,
  ) {
    return await this.subcriptionRepository.updateSubcriptionById(
      user,
      subcription_id,
      subcriptionPayload,
    );
  }

  async updateSubcriptionDetail(
    user: ReqUserToken,
    id: number,
    subcription_detail_id: number,
    subcription_detail_payload: UpdateSubcriptionDetailDto,
  ) {
    return await this.subcriptionRepository.updateSubcriptionDetail(
      user,
      id,
      subcription_detail_id,
      subcription_detail_payload,
    );
  }

  async deleteSubcription(user: ReqUserToken, id: number) {
    return await this.subcriptionRepository.deleteSubcription(user, id);
  }
}
