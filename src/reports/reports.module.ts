import { Module } from '@nestjs/common';
import { ReportsController } from 'src/reports/controller/reports.controller';
import { ReportsService } from 'src/reports/service/reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
