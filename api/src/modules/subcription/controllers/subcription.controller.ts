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
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubcriptionService } from '../services/subcription.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../../common/pipe/parse-int/parse-int.pipe';
import { CurrentUser } from '../../../common/decorators/current-user/current-user';
import { Request } from 'express';
import { SubscriptionOwnerGuard } from '../guards/subscription-owner.guard';
import { SubscriptionDetailOwnerGuard } from '../guards/subscription-detail-owner.guard';

//* GUARD PARA VERIFICAR LA PROPIEDAD DE LA SUBSCRIPCIÓN
@ApiTags('subcription')
@Controller('subcription')
export class SubcriptionController {
  constructor(private readonly __subcriptionService: SubcriptionService) {}

  @Get('')
  async findAllSubcriptions(@Req() req: Request, @CurrentUser() user) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    const { iat, exp, ...rest } = user;
    return await this.__subcriptionService.findAllSubcriptions(
      deriveMasterKey,
      rest,
    );
  }

  @UseGuards(SubscriptionOwnerGuard)
  @Get(':id')
  async findSubcriptionById(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    return await this.__subcriptionService.findSubcriptionById(
      deriveMasterKey,
      user,
      id,
    );
  }

  @Post('new')
  async createSubcription(
    @Req() req: Request,
    @Body() payload: CreateSubcriptionDto,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    return await this.__subcriptionService.createSubcription(
      deriveMasterKey,
      payload,
    );
  }

  @UseGuards(SubscriptionOwnerGuard)
  @Put(':id/edit')
  async updateSubcription(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSubcriptionDto,
  ) {
    return await this.__subcriptionService.updateSubcription(user, id, payload);
  }

  @UseGuards(SubscriptionDetailOwnerGuard)
  @Put(':id/subcription-detail/:subcription_detail_id')
  async updateSubcriptionDetail(
    @Req() req: Request,
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Param('subcription_detail_id', ParseIntPipe) sub_detail_id: number,
    @Body() payload: UpdateSubcriptionDetailDto,
  ) {
    const deriveMasterKey = Buffer.from(req['derivedKey'].data);

    return await this.__subcriptionService.updateSubcriptionDetail(
      deriveMasterKey,
      user,
      id,
      sub_detail_id,
      payload,
    );
  }

  @UseGuards(SubscriptionOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteSubcription(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.__subcriptionService.deleteSubcription(user, id);
  }
}
