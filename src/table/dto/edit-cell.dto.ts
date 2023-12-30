import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditCellDto {
  @IsNotEmpty({ message: 'CellId is required' })
  @ApiProperty({ description: 'Cell Id' })
  cellId: number;
  @IsNotEmpty({ message: 'Value is required' })
  @ApiProperty({ description: 'Cell value' })
  value: string;
}
