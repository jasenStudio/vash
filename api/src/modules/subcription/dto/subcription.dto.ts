import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';

export interface QueryListSubscription {
  page: string;
  limit: string;
  search: string;
}

export class CreateSubcriptionDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly subscription_id: number;

  @IsOptional()
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  @MinLength(3, {
    message: 'El nombre de metodo deberia tener al menos 3 caracteres',
  })
  @ApiProperty()
  readonly other_connect: string;

  @IsOptional()
  @ApiProperty()
  readonly connect_google: boolean;

  @IsOptional()
  @ApiProperty()
  readonly connect_github: boolean;

  @IsOptional()
  @ApiProperty()
  readonly connect_microsof: boolean;
}

export class CreateSubcriptionDto {
  @IsOptional()
  readonly user_name_subscription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly services_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  account_id: number;

  @IsNotEmpty()
  @ApiProperty()
  subscriptionDetail: Record<string, CreateSubcriptionDetailDto>;
}

export class UpdateSubcriptionDto extends PartialType(CreateSubcriptionDto) {}

export class UpdateSubcriptionDetailDto extends PartialType(
  CreateSubcriptionDetailDto,
) {}
