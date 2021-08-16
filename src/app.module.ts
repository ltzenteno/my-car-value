import { Module } from '@nestjs/common';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/entity/users.entity';
import { Report } from './reports/entity/report.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

// TODO: find a better solution to avoid importing entities directly in this file
const ENTITIES: EntityClassOrSchema[] = [
  User,
  Report,
];

const DB_CONFIG: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ENTITIES,
  synchronize: true,  // this option is only for dev environment, NEVER to be used when in production env
};

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
