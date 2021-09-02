import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CurrentUser } from '../../users/decorator/current-user.decorator';
import { User } from '../../users/entity/users.entity';
import { ApproveReportDto } from '../dto/approve-report.dto';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportDto } from '../dto/report.dto';
import { Report } from '../entity/report.entity';
import { ReportsService } from '../service/reports.service';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) {}

  @Serialize(ReportDto)
  @Post()
  create(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<Report> {
    return this.reportsService.create(body, user);
  }

  @Serialize(ReportDto)
  @Patch(':id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
