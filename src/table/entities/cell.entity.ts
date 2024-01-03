import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RowEntity } from 'src/table/entities/row.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cells' })
export class CellEntity {
  @ApiProperty({ description: 'The unique identifier of the cell' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The value stored in the cell' })
  @Column('text')
  value: string;

  @ApiHideProperty()
  @ManyToOne(() => RowEntity, (row) => row.cells, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'row_id' })
  row: RowEntity;

  @ApiHideProperty()
  @ManyToOne(() => ColumnEntity, (column) => column.cells, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @ApiProperty({ description: 'Timestamp of when the cell was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last update to the cell' })
  @UpdateDateColumn()
  updatedAt: Date;
}
