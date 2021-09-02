import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/users.entity';
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
  async create(dto: CreateReportDto, user: User): Promise<Report> {
    const entity = this.reportRepository.create(dto);

    entity.user = user;

    return this.reportRepository.save(entity);
  }

  async changeApproval(id: string, approved: boolean): Promise<Report> {
    // here we are fetching the related user
    // check: https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#basic-options
    const entity = await this.reportRepository.findOne(id, { relations: ['user'] });

    if (!id || !entity) {
      throw new NotFoundException('Report not found');
    }

    entity.approved = approved;
    return this.reportRepository.save(entity);
  }
}
