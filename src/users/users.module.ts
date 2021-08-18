import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AuthController, UsersController } from 'src/users/controller';
import { UsersService } from 'src/users/service/users.service';
import { User } from './entity/users.entity';
import { AuthService } from './service/auth.service';

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
  providers: [AuthService, UsersService],
})
export class UsersModule {}
