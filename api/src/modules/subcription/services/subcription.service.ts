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

  async createSubcription(
    derivedMasterKey: Buffer,
    subcriptionPayload: CreateSubcriptionDto,
  ) {
    return await this.subcriptionRepository.createSubcriptionAndDetail(
      derivedMasterKey,
      subcriptionPayload,
    );
  }

  async findAllSubcriptions(derivedMasterKey: Buffer, user: ReqUserToken) {
    return await this.subcriptionRepository.allSubcriptions(
      derivedMasterKey,
      user,
    );
  }

  async findSubcriptionById(
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    id: number,
  ) {
    return await this.subcriptionRepository.findSubcriptionById(
      deriveMasterKey,
      user,
      id,
    );
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
    deriveMasterKey: Buffer,
    user: ReqUserToken,
    id: number,
    subcription_detail_id: number,
    subcription_detail_payload: UpdateSubcriptionDetailDto,
  ) {
    return await this.subcriptionRepository.updateSubcriptionDetail(
      deriveMasterKey,
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
