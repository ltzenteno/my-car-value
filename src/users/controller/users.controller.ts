import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query, Session } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/users.entity';
import { UsersService } from '../service/users.service';

@Controller('users/')
@Serialize(UserDto)   // NOTE: this can be at global level, controller level, or method (route) level
export class UsersController {

  constructor(private userService: UsersService) {}

  @Get('me')
  whoAmI(@Session() session: any): Promise<User> {
    // session.userId is set in AuthController.createUser and AuthController.authenticate
    return this.userService.findOne(session.userId);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    console.log('2. handler is running (in UserController)');

    const user = await this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAll(@Query('email') email: string): Promise<User[]> {
    console.log('2. handler is running (in UserController)');
    return this.userService.find(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.userService.update(parseInt(id), body);
  }
}
