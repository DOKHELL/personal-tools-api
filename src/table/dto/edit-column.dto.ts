import { IsNotEmpty } from 'class-validator';
import { IsOneOfFieldsNotEmpty } from 'src/validations/general';
import { ColumnTypeEnum } from 'src/table/enums/column.enum';

export class EditColumnDto {
  @IsNotEmpty({ message: 'ColumnId name is required' })
  columnId: number;
  @IsOneOfFieldsNotEmpty(['name', 'type', 'width', 'orderIndex'], {
    message:
      'At least one of the fields (name, type, width, newOrderIndex) is required',
  })
  orderIndex: number;
  name: string;
  type: ColumnTypeEnum;
  width: number;
}
