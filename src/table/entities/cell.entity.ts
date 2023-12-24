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
import { CellValueType } from 'src/table/types/cell.types';

@Entity({ name: 'cells' })
export class CellEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  value: CellValueType;

  @ManyToOne(() => RowEntity, (row) => row.cells, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'row_id' })
  row: RowEntity;

  @ManyToOne(() => ColumnEntity, (column) => column.cells, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
