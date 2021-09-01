import { Expose, Transform } from 'class-transformer';

/**
 * Report "serializer", shared to the outside world
 */
export class ReportDto {

  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  // obj: the entity, in this case Report
  // since we just want to return the `userId`, we transform
  // the user object to just the id
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}