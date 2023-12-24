import { IsNotEmpty } from 'class-validator';
import { CellValueType } from 'src/table/types/cell.types';

export class EditCellDto {
  @IsNotEmpty({ message: 'CellId is required' })
  cellId: number;
  @IsNotEmpty({ message: 'Value is required' })
  value: CellValueType;
}
