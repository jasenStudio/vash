import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export interface QueryListAccount {
  page: string;
  limit: string;
  search: string;
}

export class AccountCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'El correo electronico de la cuenta es requerido' })
  @IsEmail(
    {},
    { message: 'El correo electronico de la cuenta debe ser valido' },
  )
  readonly account_email: string;
}

export class AccountUpdateDto extends PartialType(AccountCreateDto) {
  @ApiProperty({ required: false })
  @IsBoolean({
    message: 'El status de la cuenta debe ser un valor valido booleano',
  })
  @IsOptional()
  readonly status: boolean;
}

export class AccountIdsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Los IDs de las cuentas son requeridos' })
  readonly ids: number[];
}
