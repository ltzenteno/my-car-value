import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query, UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/users.entity';
import { UsersService } from '../service/users.service';

@Controller('users/')
export class UsersController {

  constructor(private userService: UsersService) {}

  @UseInterceptors(new SerializeInterceptor(UserDto))
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
