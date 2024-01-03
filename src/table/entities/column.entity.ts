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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'columns' })
export class ColumnEntity {
  @ApiProperty({ description: 'The unique identifier of the column' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the column' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The type of the column', enum: ColumnTypeEnum })
  @Column()
  type: ColumnTypeEnum;

  @ApiProperty({ description: 'The order index of the column' })
  @Column()
  orderIndex: number;

  @ApiProperty({ description: 'The width of the column' })
  @Column()
  width: number;

  @ApiHideProperty()
  @OneToMany(() => CellEntity, (cell) => cell.column, { onDelete: 'CASCADE' })
  cells: CellEntity[];

  @ApiHideProperty()
  @ManyToOne(() => TableEntity, (table) => table.columns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @ApiProperty({ description: 'The cells of the column', type: () => [StatusEntity] })
  @OneToMany(() => StatusEntity, (status) => status.column, {
    onDelete: 'CASCADE',
  })
  statuses: StatusEntity[];

  @ApiProperty({ description: 'Timestamp of when the column was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last update to the column' })
  @UpdateDateColumn()
  updatedAt: Date;
}
