import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { RowEntity } from 'src/table/entities/row.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'tables' })
export class TableEntity {
  @ApiProperty({ description: 'The unique identifier of the table' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the table' })
  @Column()
  name: string;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.tables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ description: 'The columns of the table', type: () => [ColumnEntity] })
  @OneToMany(() => ColumnEntity, (column) => column.table, { onDelete: 'CASCADE' })
  columns: ColumnEntity[];

  @ApiProperty({ description: 'The rows of the table', type: () => [RowEntity] })
  @OneToMany(() => RowEntity, (row) => row.table, { onDelete: 'CASCADE' })
  rows: RowEntity[];

  @ApiProperty({ description: 'Timestamp of when the table was created' })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ description: 'Timestamp of the last update to the table' })
  @UpdateDateColumn()
  updatedAt: Date;
}
