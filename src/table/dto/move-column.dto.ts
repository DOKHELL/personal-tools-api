import { IsNotEmpty } from 'class-validator';

export class MoveColumnDto {
  @IsNotEmpty({ message: 'ColumnId name is required' })
  columnId: number;
  @IsNotEmpty({ message: 'NewOrderIndex name is required' })
  newOrderIndex: number;
}
