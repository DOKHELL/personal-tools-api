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

@Entity({ name: 'tables' })
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.tables)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ColumnEntity, (column) => column.table, {
    onDelete: 'CASCADE',
  })
  columns: ColumnEntity[];

  @OneToMany(() => RowEntity, (row) => row.table, { onDelete: 'CASCADE' })
  rows: RowEntity[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
