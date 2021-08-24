import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/users.entity';
import { AuthService } from '../service/auth.service';

@Controller('auth/')
@Serialize(UserDto)
export class AuthController {

  constructor(
    private authService: AuthService
    ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signUp(body);

    session.userId = user.id;

    return user;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.authenticate(body);

    session.userId = user.id;

    return user;
  }

  @Post('signout')
  signOut(@Session() session: any): void {
    session.userId = null;
  }

  // ----- START cookie session example methods (not used in the app, just to see how cookies work)

  // NOTE: this approach (cookie session) is STATEFUL
  // it is better to use other solutions like JWT

  @Get('colors/:color')
  setColor(@Param('color') color: string, @Session() session: any): void {
    session.color = color;
  }

  @Get('colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  // ----- END cookie session example methods
}