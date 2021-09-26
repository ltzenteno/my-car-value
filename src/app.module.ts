import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { WarmupService } from './warmup.service';

const cookieSession = require('cookie-session');

const CONFIG_OPTIONS: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'development' ? '.env' : `${process.env.NODE_ENV}.env`,
};

@Module({
  imports: [
    ConfigModule.forRoot(CONFIG_OPTIONS),
    TypeOrmModule.forRoot(),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WarmupService,
    {   // NOTE: moving ValidationPipe from main.ts to app.module.ts, so we can use it in e2e tests! (this is a better approach than doing it in main.ts)
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,  // strips validated object (removes extra attributes)
      }),
    },
  ],
})
export class AppModule {

  constructor(private configService: ConfigService) {}

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
      keys: [this.configService.get('COOKIE_KEY')],
    })).forRoutes('*');
  }
}
