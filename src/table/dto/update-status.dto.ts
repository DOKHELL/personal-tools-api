import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ description: 'Status Id' })
  @IsNotEmpty({ message: 'StatusId is required' })
  statusId: number;
  @ApiProperty({ description: 'Status label' })
  @IsNotEmpty({ message: 'Label is required' })
  label: string;
}
