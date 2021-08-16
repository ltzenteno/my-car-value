import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ReportsController } from 'src/reports/controller/reports.controller';
import { ReportsService } from 'src/reports/service/reports.service';
import { Report } from './entity/report.entity';

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
