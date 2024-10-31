import { PartialType } from '@nestjs/swagger';
import { IsEnum, isNotEmpty, IsNotEmpty } from 'class-validator';
export enum method_type {
  password_recovery = 'password_recovery',
  email_recovery = 'email_recovery',
  token_recovery = 'token_recovery',
  phone_recovery = 'phone_recovery',
}

export class CreateMethodRecoveryDto {
  @IsNotEmpty({ message: 'El tipo de recuperación es obligatorio' })
  @IsEnum(method_type, {
    message:
      'El tipo de recuperación debe ser uno de los valores permitidos:  password_recovery, email_recovery, token_recovery, phone_recovery',
  })
  readonly method_type: method_type;

  @IsNotEmpty({ message: 'El valor del metodo es obligatorio' })
  readonly method_value: string;
}

export class UpdateMethodRecoveryDto extends PartialType(
  CreateMethodRecoveryDto,
) {}
