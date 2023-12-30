import { IsEnum, IsNotEmpty } from 'class-validator';
import { ColumnTypeEnum } from 'src/table/enums/column.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @IsNotEmpty({ message: 'TableId name is required' })
  @ApiProperty({ description: 'Table Id' })
  tableId: number;
  @IsNotEmpty({ message: 'Column name is required' })
  @ApiProperty({ description: 'Column Name' })
  name: string;
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(ColumnTypeEnum)
  @ApiProperty({ description: 'Column Type' })
  type: ColumnTypeEnum;
  @ApiProperty({ description: 'Column Width' })
  width?: number;
}
