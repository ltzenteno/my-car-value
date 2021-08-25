import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AuthController, UsersController } from './controller';
import { User } from './entity/users.entity';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';
import { AuthService } from './service/auth.service';
import { UsersService } from './service/users.service';

/**
 * List that contains all entities for this module
 * (it will create a Repository internally)
 */
const ENTITIES: EntityClassOrSchema[] = [
  User,
];

@Module({
  controllers: [UsersController, AuthController],
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: [
    AuthService,
    UsersService,
    // NOTES:
    // adding a globally scoped interceptor (to avoid adding the interceptor in each controller in the app)
    // but keep in mind that with this approach, every controller will do a DB query to get the current user
    // even though some of those controllers don't really need the current user
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    }
  ],
})
export class UsersModule {}
