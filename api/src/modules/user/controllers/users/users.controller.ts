import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../../dto/user.dto';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly UserService: UserService,
  ) {}
  // @Get('/')
  // async getUsers() {
  //   return this.userRepository.findAll('jsalgadoecheverria@gmail.com');
  // }

  @Post('/new')
  async createUser(@Body() payload: CreateUserDTO) {
    return await this.UserService.createUser(payload);
  }
}
