import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../../common/pipe/parse-int/parse-int.pipe';
import { CurrentUser } from '../../../common/decorators/current-user/current-user';
import { MethodsRecoveryService } from '../services';
import {
  CreateMethodRecoveryDto,
  UpdateMethodRecoveryDto,
} from '../dto/method-recovery.dto';
import { Request } from 'express';
import { RecoveryMethodOwnerGuard } from '../guards/recovery-method-owner.guard';
import { RecoveryMethodUpdateAndDeleteOwner } from '../guards/recovery-method-update-delete-owner.guard';

@ApiTags('methods-recovery')
@Controller('subcriptions-details/')
export class MethodsRecoveryController {
  constructor(private readonly __recoveryService: MethodsRecoveryService) {}

  @UseGuards(RecoveryMethodOwnerGuard)
  @Get(':sub_detail_id/methods-recovery')
  async findAllMethods(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id: number,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    return await this.__recoveryService.findAllMethodsRecovery(
      deriveMasterKey,
      user,
      sub_detail_id,
    );
  }

  @UseGuards(RecoveryMethodOwnerGuard)
  @Post(':sub_detail_id/methods-recovery/new')
  async createMethod(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id,
    @Body() payload: CreateMethodRecoveryDto,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);
    return await this.__recoveryService.createMethodRecovery(
      deriveMasterKey,
      user,
      sub_detail_id,
      payload,
    );
  }

  @UseGuards(RecoveryMethodUpdateAndDeleteOwner)
  @Put(':sub_detail_id/methods-recovery/:method_id/edit')
  async updateMethod(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id,
    @Param('method_id', ParseIntPipe) method_id,
    @Body() payload: UpdateMethodRecoveryDto,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    return await this.__recoveryService.updateMethodRecovery(
      deriveMasterKey,
      user,
      sub_detail_id,
      method_id,
      payload,
    );
  }

  @UseGuards(RecoveryMethodUpdateAndDeleteOwner)
  @Delete(':sub_detail_id/methods-recovery/:method_id')
  async deleteMethod(
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id,
    @Param('method_id', ParseIntPipe) method_id,
  ) {
    return await this.__recoveryService.deleteMethodRecovery(
      user,
      sub_detail_id,
      method_id,
    );
  }
}
