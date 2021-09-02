import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entity/users.entity';

@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  approved: boolean;

  /*
   * @param first param: we always pass a function that returns the entity
   * to avoid problems when having circular dependencies
   * @param second param: specific to typeORM, how the entity instance will relate to this entity
   */
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}