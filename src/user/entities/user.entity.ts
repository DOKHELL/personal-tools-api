import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TableEntity } from 'src/table/entities/table.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Username' })
  username: string;

  @OneToMany(() => TableEntity, (table) => table.user, { onDelete: 'CASCADE' })
  tables: TableEntity[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp of when the user was created' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp of the last update to the user' })
  updatedAt: Date;
}
