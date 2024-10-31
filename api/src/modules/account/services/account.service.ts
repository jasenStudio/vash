import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}
  async findAllAccount() {
    return this.accountRepository.findAll();
  }
}
