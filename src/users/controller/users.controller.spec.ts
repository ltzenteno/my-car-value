import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entity/users.entity';
import { UsersService } from '../service/users.service';
import { UsersController } from './users.controller';

/*
 * check: https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
 * and https://github.com/ilearnio/module-alias
 * to implement alias in both nest and jest (via "moduleNameMapper")
 * and be able to use alias like:
 * import { User } from '@/users/entity/users.entity';
 * instead of
 * import { User } from '../entity/users.entity';
 */

/**
 * We are just testing the functions of the controller without any decorators
 * so we are not testing with HTTP requests per se.
 */
describe('UsersController', () => {
  let controller: UsersController;
  let mockUserService: Partial<UsersService>;

  beforeEach(async () => {
    mockUserService = {
      find: (email: string): Promise<User[]> => Promise.resolve([{ id: 1, email, password: 'secret'} as User]),
      findOne: (id: number): Promise<User> => Promise.resolve({ id, email: 'test@test.com', password: 'secret'} as User),
      // remove: () => {},
      // update: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ('findAll returns a list of users with the given email', async () => {
    const [user] = await controller.findAll('test@test.com');

    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
  });

  it('find returns a user', async () => {
    const user = await controller.find('1');

    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
  });
});
