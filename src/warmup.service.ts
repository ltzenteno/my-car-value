import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { getConnection, MigrationExecutor } from 'typeorm';

@Injectable()
export class WarmupService implements OnApplicationBootstrap {

  async onApplicationBootstrap() {
    const connection = getConnection();
    const pendingMigrations = await new MigrationExecutor(connection, connection.createQueryRunner('master')).getPendingMigrations();

    //TODO: how to add colors to Logger ??
    // https://www.codegrepper.com/code-examples/javascript/node+js+colored+logger+multiple+colors
    Logger.log(`${pendingMigrations.length} pending migrations to apply.`, 'MIGRATIONS');

    pendingMigrations.forEach((migration) => {
      Logger.log(migration.name, 'MIGRATIONS');
    });
  }
}