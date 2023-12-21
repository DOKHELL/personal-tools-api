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

@Entity({ name: 'cells' })
export class CellEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  value: string;

  @ManyToOne(() => RowEntity, (row) => row.cells)
  @JoinColumn({ name: 'row_id' })
  row: RowEntity;

  @ManyToOne(() => ColumnEntity, (column) => column.cells)
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
