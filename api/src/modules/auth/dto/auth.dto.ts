import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  isNotEmpty,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'El correo del usuario',
  })
  @IsNotEmpty()
  @MinLength(4, {
    message: 'El usuario debe tener al menos 4 caracteres',
  })
  readonly user_name: string;

  @ApiProperty({
    example: '123456',
    description: 'La contraseña del usuario',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  readonly password: string;
}

export class CreateAuthUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'El correo del usuario',
  })
  @IsEmail({}, { message: 'El correo es obligatorio' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @MinLength(4, {
    message: 'El usuario debe tener al menos 4 caracteres',
  })
  readonly user_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  readonly password: string;
}

export class ReqUserToken {
  @IsNotEmpty()
  id?: number | string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  status: boolean;
  @IsNotEmpty()
  is_admin: boolean;
}
