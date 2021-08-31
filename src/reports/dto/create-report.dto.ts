import { IsInt, IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1980)
  @Max(2050)
  year: number;

  @Max(1000000)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}