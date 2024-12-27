import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AccountCreateDto,
  AccountIdsDto,
  AccountUpdateDto,
  QueryListAccount,
} from '../dto/account.dto';
import { AccountService } from '../../account/services/account.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user/current-user';
import { ParseIntPipe } from 'src/common/pipe/parse-int/parse-int.pipe';
import { AccountOwnerGuard } from '../guards/account-owner.guard';
import { AccountsOwnerGuard } from '../guards/accounts-owner.guard';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private __accountService: AccountService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@CurrentUser() user, @Query() query: QueryListAccount) {
    console.log(query.page, query.limit, query['search']);
    return await this.__accountService.findAllAccount(user, query);
  }

  @HttpCode(HttpStatus.OK)
  @Post('new')
  async createAccount(
    @CurrentUser() user,
    @Body() accountPayload: AccountCreateDto,
  ) {
    return await this.__accountService.createAccount(user, accountPayload);
  }

  @UseGuards(AccountOwnerGuard)
  @HttpCode(HttpStatus.OK)
  @Put('edit/:id')
  async updateAccount(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() accountPayload: AccountUpdateDto,
  ) {
    return await this.__accountService.updateAccount(user, id, accountPayload);
  }

  @UseGuards(AccountOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteAccount(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.__accountService.deleteAccount(user, id);
  }

  @UseGuards(AccountsOwnerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('batch-delete')
  async deleteAccounts(
    @CurrentUser() user,
    @Body() accountsPayload: AccountIdsDto,
  ) {
    console.log(accountsPayload);
    return await this.__accountService.deleteAccounts(user, accountsPayload);
  }
}
