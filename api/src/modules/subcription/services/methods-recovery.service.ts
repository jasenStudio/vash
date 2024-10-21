import { Injectable } from '@nestjs/common';
import { ReqUserToken } from 'src/modules/auth/dto/auth.dto';
import { MethodRecoveryRepository } from '../repositories/methods-recovery.repository';
import {
  CreateMethodRecoveryDto,
  UpdateMethodRecoveryDto,
} from '../dto/method-recovery.dto';

@Injectable()
export class MethodsRecoveryService {
  constructor(private readonly methodResository: MethodRecoveryRepository) {}
  async findAllMethodsRecovery(user: ReqUserToken, sub_detail_id: number) {
    return await this.methodResository.allMethodRecovery(user, sub_detail_id);
  }

  async createMethodRecovery(
    sub_detail_id: number,
    methodPayload: CreateMethodRecoveryDto,
  ) {
    return await this.methodResository.createMethodRecovery(
      sub_detail_id,
      methodPayload,
    );
  }

  async updateMethodRecovery(
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
    methodRecoveryPayload: UpdateMethodRecoveryDto,
  ) {
    return await this.methodResository.updateMethodById(
      user,
      sub_detail_id,
      method_id,
      methodRecoveryPayload,
    );
  }

  async deleteMethodRecovery(
    user: ReqUserToken,
    sub_detail_id: number,
    method_id: number,
  ) {
    return await this.methodResository.deleteMethodRecovery(
      user,
      sub_detail_id,
      method_id,
    );
  }
}
