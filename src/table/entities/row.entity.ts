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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'rows' })
export class RowEntity {
  @ApiProperty({ description: 'The unique identifier of the row' })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CellEntity, (cell) => cell.row, { onDelete: 'CASCADE' })
  cells: CellEntity[];

  @ManyToOne(() => TableEntity, (table) => table.rows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @ApiProperty({ description: 'Timestamp of when the row was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last update to the row' })
  @UpdateDateColumn()
  updatedAt: Date;
}
