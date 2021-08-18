import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/users.entity';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../service/users.service';

@Controller('auth/')
@Serialize(UserDto)
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService
    ) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signUp(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  authenticate(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.authenticate(body);
  }
}