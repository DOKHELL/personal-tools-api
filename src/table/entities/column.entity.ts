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
import { TableEntity } from 'src/table/entities/table.entity';
import { CellEntity } from 'src/table/entities/cell.entity';

@Entity({ name: 'columns' })
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  orderIndex: number;

  @ManyToOne(() => TableEntity, (table) => table.columns)
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @OneToMany(() => CellEntity, (cell) => cell.column, { onDelete: 'CASCADE' })
  cells: CellEntity[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
