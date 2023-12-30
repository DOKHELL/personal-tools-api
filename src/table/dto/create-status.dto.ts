import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusDto {
  @IsNotEmpty({ message: 'ColumnId is required' })
  @ApiProperty({ description: 'Column Id' })
  columnId: number;
  @IsNotEmpty({ message: 'Label is required' })
  @ApiProperty({ description: 'Column label' })
  label: string;
}
