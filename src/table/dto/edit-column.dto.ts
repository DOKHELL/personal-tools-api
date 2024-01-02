import { IsNotEmpty } from 'class-validator';
import { IsOneOfFieldsNotEmpty } from 'src/validations/general';
import { ColumnTypeEnum } from 'src/table/enums/column.enum';
import { ApiProperty } from '@nestjs/swagger';

export class EditColumnDto {
  @IsNotEmpty({ message: 'ColumnId name is required' })
  @ApiProperty({ description: 'Column id' })
  columnId: number;
  @IsOneOfFieldsNotEmpty(['name', 'type', 'width', 'orderIndex'], {
    message: 'At least one of the fields (name, type, width, newOrderIndex) is required',
  })
  @ApiProperty({ description: 'Column order index', required: false })
  orderIndex?: number;
  @ApiProperty({ description: 'Column name', required: false })
  name?: string;
  @ApiProperty({ description: 'Column type', required: false })
  type?: ColumnTypeEnum;
  @ApiProperty({ description: 'Column width', required: false })
  width?: number;
}
