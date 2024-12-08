import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'El correo electronico de la cuenta es requerido' })
  @IsEmail(
    {},
    { message: 'El correo electronico de la cuenta debe ser valido' },
  )
  readonly account_email: string;
}

export class AccountUpdateDto extends PartialType(AccountCreateDto) {}
