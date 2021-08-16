import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/users.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  /**
   * Creates and saves a user
   * @param {CreateUserDto} dto
   * @returns {Promise<User>}
   */
  create(dto: CreateUserDto): Promise<User> {
    const entity = this.userRepository.create(dto);

    return this.userRepository.save(entity);
  }
}
