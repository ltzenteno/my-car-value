import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/users.entity';
import { UsersService } from './users.service';

// NOTE: since scrypt only works with callbacks, we use promisify to be able to work with promises with scrypt
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

  constructor(private userService: UsersService) {}

  async signUp(userDto: CreateUserDto): Promise<User> {
    // 1. see of email is in use
    const [existingUser] = await this.userService.find(userDto.email);

    if (existingUser) {
      throw new BadRequestException('email is already in use');
    }

    // 2. genereate salt & hash the password
    // generate salt (16 numbers length)
    const salt = randomBytes(8).toString('hex');

    // hash the salt and the password together (32 characaters)
    const hash = (await scrypt(userDto.password, salt, 32)) as Buffer;

    // join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;

    // 3. create new user and save it
    const dto = new CreateUserDto();
    dto.email = userDto.email;
    dto.password = result;

    return this.userService.create(dto);
  }

  async authenticate(userDto: CreateUserDto): Promise<User> {
    const [user] = await this.userService.find(userDto.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(userDto.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}