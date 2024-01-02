import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOneOfFieldsNotEmpty } from 'src/validations/general';

export class UpdateStatusDto {
  @ApiProperty({ description: 'Status Id' })
  @IsNotEmpty({ message: 'StatusId is required' })
  statusId: number;
  @IsOneOfFieldsNotEmpty(['label', 'color'], {
    message: 'At least one of the fields (label, color) is required',
  })
  @ApiProperty({ description: 'Status label' })
  label?: string;
  @ApiProperty({ description: 'Status color' })
  color?: string;
}
