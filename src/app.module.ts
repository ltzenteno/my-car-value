import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/entity/users.entity';
import { Report } from './reports/entity/report.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { APP_PIPE } from '@nestjs/core';

const cookieSession = require('cookie-session');

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
  providers: [
    AppService,
    {   // NOTE: moving ValidationPipe from main.ts to app.module.ts, so we can use it in e2e tests! (this is a better approach than doing it in main.ts)
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,  // strips validated object (removes extra attributes)
      }),
    },
  ],
})
export class AppModule {
  /**
   * This configure fn is going to be called automatically
   * whenever our application starts listening for incoming traffic
   * code inside will run on every single request
   * @param consumer 
   */
  configure(consumer: MiddlewareConsumer) {
    // NOTE: moving coookieSession from main.ts
    // to configure fn to be able to use it in e2e tests
    // (this is a better approach than to use it in main.ts)

    // adding cookie session middleware (globally scoped)
    consumer.apply(cookieSession({
      keys: ['owkeoijcmawj'], // random characters TODO: find a better solution
    })).forRoutes('*');
  }
}
