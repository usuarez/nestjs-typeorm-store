import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @BeforeInsert()
  nameToLowerCase() {
    this.name = this.name
      .trim()
      .toLocaleLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }
}
