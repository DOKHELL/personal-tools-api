import { IsNotEmpty } from 'class-validator';

export class CreateRowDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  tableId: number;
}
