
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { CreateReportDto } from './create-report.dto';

/**
 * Using PartialType and OmitType from mapped-types to reuse existing DTOs
 */
export class GetEstimateDto extends PartialType(OmitType(CreateReportDto,
  ['price'] as const,
)) {

  // we transform the value of year from srting to int
  // since thr query param comes as a string
  @Transform(({ value }) => parseInt(value))
  year: number;

  // same here
  @Transform(({ value }) => parseInt(value))
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  lat:number;
}