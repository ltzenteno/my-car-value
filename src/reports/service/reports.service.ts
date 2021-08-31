import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from '../entity/report.entity';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) {}

  /**
   * Creates and saves a report
   * @param {CreateReportDto} dto 
   * @returns {Promise<Report>}
   */
  async create(dto: CreateReportDto): Promise<Report> {
    const entity = this.reportRepository.create(dto);

    return this.reportRepository.save(entity);
  }
}
