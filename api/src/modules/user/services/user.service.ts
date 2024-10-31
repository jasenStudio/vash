import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserByEmailOrUserName(search: string) {
    return await this.userRepository.getUserByTerm(search);
  }

  async createUser(userPayload: CreateUserDTO) {
    const result = await this.userRepository.createUser(userPayload);
    return result;
  }
}
