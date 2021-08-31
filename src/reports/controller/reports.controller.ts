import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from '../entity/report.entity';
import { ReportsService } from '../service/reports.service';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) {}

  @Post()
  create(@Body() body: CreateReportDto): Promise<Report> {
    return this.reportsService.create(body);
  }
}
