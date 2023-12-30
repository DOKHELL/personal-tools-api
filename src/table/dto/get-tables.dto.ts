import { ApiProperty } from '@nestjs/swagger';
import { CellEntity } from 'src/table/entities/cell.entity';
import { StatusEntity } from 'src/table/entities/status.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { RowEntity } from 'src/table/entities/row.entity';
import { TableEntity } from 'src/table/entities/table.entity';

class ColumnDto extends ColumnEntity {
  @ApiProperty({
    description: 'Cells associated with the column',
    type: [CellEntity],
  })
  cells: CellEntity[];
  @ApiProperty({
    description: 'Statuses associated with the column',
    type: [StatusEntity],
  })
  statuses: StatusEntity[];
}

class RowDto extends RowEntity {
  @ApiProperty({
    description: 'Cells associated with the row',
    type: [CellEntity],
  })
  cells: CellEntity[];
}

export class FullTableDto extends TableEntity {
  @ApiProperty({
    description: 'Columns associated with the table',
    type: [ColumnDto],
  })
  columns: ColumnDto[];
  @ApiProperty({
    description: 'Rows associated with the table',
    type: [RowDto],
  })
  rows: RowDto[];
}
