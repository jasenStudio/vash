import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../account/services/account.service';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private __accountService: AccountService) {}

  @Get()
  async findAll() {
    return await this.__accountService.findAllAccount();
  }
}
