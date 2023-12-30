import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from 'src/table/table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from 'src/table/entities/table.entity';
import { RowEntity } from 'src/table/entities/row.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { CellEntity } from 'src/table/entities/cell.entity';
import { StatusEntity } from 'src/table/entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity, RowEntity, ColumnEntity, CellEntity, StatusEntity])],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
