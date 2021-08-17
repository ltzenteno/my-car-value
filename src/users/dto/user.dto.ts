import { Expose } from 'class-transformer';

/**
 * DTO that is shared to the 'outside world'
 */
export class UserDto {

  @Expose()
  id: number;

  @Expose()
  email: string;
}