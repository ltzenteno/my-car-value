import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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