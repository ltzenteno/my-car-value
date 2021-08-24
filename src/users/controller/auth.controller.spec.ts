import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/users.entity';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../service/users.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UsersService>;
  let dto: CreateUserDto;

  beforeEach(async () => {

    dto = new CreateUserDto();

    dto.email = 'test@test.com';
    dto.password = 'secretpassword';
    
    mockUserService = {
      find: (email: string): Promise<User[]> => Promise.resolve([{ id: 1, email, password: 'secret'} as User]),
      findOne: (id: number): Promise<User> => Promise.resolve({ id, email: 'test@test.com', password: 'secret'} as User),
    };

    
    mockAuthService = {
      // signUp: (dto: CreateUserDto): Promise<User> => Promise.resolve({id: 1, email: dto.email, password: dto.password} as User),
      authenticate: (userDto: CreateUserDto): Promise<User> => Promise.resolve({id: 1, email: userDto.email, password: userDto.password} as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('authenticate updates session object and returns user', async () => {
    const session = {
      userId: null,
    };

    const user = await controller.authenticate({ email: dto.email, password: dto.password } as CreateUserDto, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('signs out successfully', async () => {
    const session = {
      userId: null,
    };

    await controller.authenticate({ email: dto.email, password: dto.password } as CreateUserDto, session);

    expect(session.userId).toEqual(1);

    // sign out
    controller.signOut(session);

    expect(session.userId).toBeNull();
  });
});