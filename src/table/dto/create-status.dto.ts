import { IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsNotEmpty({ message: 'ColumnId is required' })
  columnId: number;
  @IsNotEmpty({ message: 'Label is required' })
  label: string;
}
