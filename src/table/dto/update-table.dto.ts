import { IsNotEmpty } from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  tableId: number;
  @IsNotEmpty({ message: 'Table name is required' })
  name: string;
}
