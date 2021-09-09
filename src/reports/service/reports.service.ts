import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { GetEstimateDto } from '../dto/get-estimate-dto';
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

  /**
   * Find reports for the same make and model, within +/- 5 degrees, within 3 years and order by closest mileage
   * then return the top 3 closest reports
   * @param {GetEstimateDto} dto
   * @returns {Promise<Report[]>}
   */
  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto): Promise<Report> {
    return this.reportRepository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make like :make', { make: `%${make}%` })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne<Report>();
  }
}
