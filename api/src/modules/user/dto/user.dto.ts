import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
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
