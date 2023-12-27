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
import { ColumnTypeEnum } from 'src/table/enums/column.enum';
import { StatusEntity } from 'src/table/entities/status.entity';

@Entity({ name: 'columns' })
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: ColumnTypeEnum;

  @Column()
  orderIndex: number;

  @Column()
  width: number;

  @ManyToOne(() => TableEntity, (table) => table.columns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @OneToMany(() => CellEntity, (cell) => cell.column, { onDelete: 'CASCADE' })
  cells: CellEntity[];

  @OneToMany(() => StatusEntity, (status) => status.column, {
    onDelete: 'CASCADE',
  })
  statuses: StatusEntity[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
