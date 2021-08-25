import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ReportsController } from './controller/reports.controller';
import { Report } from './entity/report.entity';
import { ReportsService } from './service/reports.service';

/**
 * List that contains all entities for this module
 * (it will create a Repository internally)
 */
const ENTITIES: EntityClassOrSchema[] = [
  Report,
]

@Module({
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: [ReportsService]
})
export class ReportsModule {}
