import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
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

@ApiTags('methods-recovery')
@Controller('subcriptions-details/')
export class MethodsRecoveryController {
  constructor(private readonly __recoveryService: MethodsRecoveryService) {}
  @Get(':sub_detail_id/methods-recovery')
  async findAllMethods(
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id: number,
  ) {
    return await this.__recoveryService.findAllMethodsRecovery(
      user,
      sub_detail_id,
    );
  }

  @Post(':sub_detail_id/methods-recovery/new')
  async createMethod(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id,
    @Body() payload: CreateMethodRecoveryDto,
  ) {
    console.log(sub_detail_id);
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);
    return await this.__recoveryService.createMethodRecovery(
      deriveMasterKey,
      user,
      sub_detail_id,
      payload,
    );
  }

  @Put(':sub_detail_id/methods-recovery/:method_id/edit')
  async updateMethod(
    @CurrentUser() user,
    @Param('sub_detail_id', ParseIntPipe) sub_detail_id,
    @Param('method_id', ParseIntPipe) method_id,
    @Body() payload: UpdateMethodRecoveryDto,
  ) {
    return await this.__recoveryService.updateMethodRecovery(
      user,
      sub_detail_id,
      method_id,
      payload,
    );
  }

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
