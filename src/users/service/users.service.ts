import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(id: number): Promise<User> {

    // this is because a "glitch" on the findOne method
    if (!id) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.findOne(id);
  }

  find(email: string): Promise<User[]> {
    return this.userRepository.find({ email });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const entity = await this.findOne(id);

    if (!entity) {
      // TODO: throw a TypeORM exception
      throw new NotFoundException('User not found');
    }

    Object.assign(entity, attrs);

    return this.userRepository.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    if (!entity) {
      // TODO: throw a TypeORM exception
      throw new NotFoundException('User not found');
    }

    // we use remove instead of delete(id) passing an entity to run the @AfterRemove hook inside the entity
    return this.userRepository.remove(entity);
  }
}
