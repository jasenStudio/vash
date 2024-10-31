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
import { SubcriptionService } from '../services/subcription.service';
import {
  CreateSubcriptionDto,
  UpdateSubcriptionDetailDto,
  UpdateSubcriptionDto,
} from '../dto/subcription.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../../common/pipe/parse-int/parse-int.pipe';
import { CurrentUser } from '../../../common/decorators/current-user/current-user';

@ApiTags('subcription')
@Controller('subcription')
export class SubcriptionController {
  constructor(private readonly __subcriptionService: SubcriptionService) {}

  @Get('')
  async findAllSubcriptions(@CurrentUser() user) {
    const { iat, exp, ...rest } = user;
    return await this.__subcriptionService.findAllSubcriptions(rest);
  }

  @Get(':id')
  async findSubcriptionById(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.__subcriptionService.findSubcriptionById(user, id);
  }

  @Post('new')
  async createSubcription(@Body() payload: CreateSubcriptionDto) {
    return await this.__subcriptionService.createSubcription(payload);
  }

  @Put(':id/edit')
  async updateSubcription(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSubcriptionDto,
  ) {
    console.log(user);
    console.log(payload.account_id);

    return await this.__subcriptionService.updateSubcription(user, id, payload);
  }

  @Put(':id/subcription-detail/:subcription_detail_id')
  async updateSubcriptionDetail(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Param('subcription_detail_id', ParseIntPipe) sub_detail_id: number,
    @Body() payload: UpdateSubcriptionDetailDto,
  ) {
    return await this.__subcriptionService.updateSubcriptionDetail(
      user,
      id,
      sub_detail_id,
      payload,
    );
  }

  @Delete(':id')
  async deleteSubcription(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.__subcriptionService.deleteSubcription(user, id);
  }
}
