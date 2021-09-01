import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../../reports/entity/report.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // here we could use the @Exclude() and it would exclude this field from every response
  // but instead we will implement a custom interceptor (better solution)
  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];


  // TODO: move listeners down below to subscribers outside the entity
  // https://medium.com/@Semyonic/subscribers-a-k-a-entity-listeners-of-typeorm-on-nestjs-a97ac75acc2d
  /**
   * Function that logs after inserting into the DB
   * it uses the `@AfterInsert` TypeORM hook
   */
  @AfterInsert()
  private logInsert(): void {
    console.log('Inserted user with id: ', this.id);
  }

  /**
   * Function that logs after updating
   * using a TypeORM hook
   */
  @AfterUpdate()
  private logUpdate(): void {
    console.log('Updated user with id: ', this.id);
  }

  /**
   * Function that logs after removing
   * using a TypeORM hook
   */
  @AfterRemove()
  private afterRemove(): void {
    console.log('Removed user with id: ', this.id);
  }
}