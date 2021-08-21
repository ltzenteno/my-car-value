import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/users.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    mockUserService = {
      find: () => Promise.resolve([]),
      create: (dto: CreateUserDto): Promise<User> => Promise.resolve({ id: 1, email: dto.email, password: dto.password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [  // --> providers is a list of things we want to register in our testing DI container
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    // getting an instance of the service
    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of the service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const dto = new CreateUserDto();

    dto.email = 'test@test.com';
    dto.password = 'secretpassword';

    const entity = await service.signUp(dto);

    // since entity password must be hashed, we expect it to be different than
    // the dto. password
    expect(entity.password).not.toEqual(dto.password);

    const [salt, hash] = entity.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // changing the mock service implementation of find function for this specific test
    mockUserService.find = () => Promise.resolve([{ id: 1, email: 'a', password: 'abc' } as User]);

    const dto = new CreateUserDto();

    dto.email = 'test@test.com';
    dto.password = 'secretpassword';

    const promise = service.signUp(dto);

    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  });

  describe('authenticate', () => {
    let dto: CreateUserDto;

    beforeEach(() => {
      dto = new CreateUserDto();

      dto.email = 'test@test.com';
      dto.password = 'secretpassword';
    });

    it('throws an error if authenticate is called with an unused email', async () => {
      const promise = service.authenticate(dto);

      await expect(promise).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws an error if password is incorrect', async () => {
      // first we create the user to generate the hashed password
      const entity = await service.signUp(dto);

      const { id, email, password } = entity;

      // mock find method to return the created entity
      mockUserService.find = () => Promise.resolve([{ id, email, password } as User]);

      // we set an incorrect password
      dto.password = 'incorrectpassword';

      const promise = service.authenticate(dto);

      await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    });

    it('successfully authenticates user if credentials are correct', async () => {
      // first we create the user to generate the hashed password
      const entity = await service.signUp(dto);

      const { id, email, password } = entity;

      // mock find method to return the created entity
      mockUserService.find = () => Promise.resolve([{ id, email, password } as User]);

      const authenticatedUser = await service.authenticate(dto);

      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.password).toEqual(entity.password);
    });
  });
});