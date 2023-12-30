import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRowDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  @ApiProperty({ description: 'Table Id' })
  tableId: number;
}
