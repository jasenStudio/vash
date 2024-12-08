import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { ReqUserToken } from 'src/modules/auth/dto/auth.dto';
import { AccountCreateDto, AccountUpdateDto } from '../dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}
  async findAllAccount(user: ReqUserToken) {
    return this.accountRepository.findAll(user);
  }

  async createAccount(user: ReqUserToken, accountPayload: AccountCreateDto) {
    return this.accountRepository.create(user, accountPayload);
  }

  async updateAccount(
    user: ReqUserToken,
    id: number,
    accountPayload: AccountUpdateDto,
  ) {
    return this.accountRepository.update(user, id, accountPayload);
  }

  async deleteAccount(user: ReqUserToken, id: number) {
    return this.accountRepository.delete(user, id);
  }
}
