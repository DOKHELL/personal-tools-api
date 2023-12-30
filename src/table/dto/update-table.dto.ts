import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTableDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  @ApiProperty({ description: 'Table Id' })
  tableId: number;
  @IsNotEmpty({ message: 'Table name is required' })
  @ApiProperty({ description: 'Table name' })
  name: string;
}
