import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @IsNotEmpty({ message: 'Table name is required' })
  @ApiProperty({ description: 'Table Name' })
  name: string;
}
