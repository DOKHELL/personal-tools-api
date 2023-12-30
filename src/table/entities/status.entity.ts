import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'statuses' })
export class StatusEntity {
  @ApiProperty({ description: 'The unique identifier of the status' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The label of the status' })
  @Column()
  label: string;

  @ManyToOne(() => ColumnEntity, (column) => column.statuses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @ApiProperty({ description: 'Timestamp of when the status was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last update to the status' })
  @UpdateDateColumn()
  updatedAt: Date;
}
