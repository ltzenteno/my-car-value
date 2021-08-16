import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';

@Controller('auth/')
export class AuthController {

  constructor(private userService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto): void {
    this.userService.create(body);
  }
}