import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  format: string;

  @Column()
  public_id: string;
}
