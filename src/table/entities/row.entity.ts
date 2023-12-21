import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TableEntity } from 'src/table/entities/table.entity';
import { CellEntity } from 'src/table/entities/cell.entity';

@Entity({ name: 'rows' })
export class RowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TableEntity, (table) => table.rows)
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @OneToMany(() => CellEntity, (cell) => cell.row, { onDelete: 'CASCADE' })
  cells: CellEntity[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
