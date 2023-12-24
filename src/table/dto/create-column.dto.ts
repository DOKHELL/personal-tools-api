import { IsEnum, IsNotEmpty } from 'class-validator';
import { ColumnTypeEnum } from 'src/table/enums/column.enum';

export class CreateColumnDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  tableId: number;
  @IsNotEmpty({ message: 'Column name is required' })
  name: string;
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(ColumnTypeEnum)
  type: ColumnTypeEnum;
  width?: number;
}
