import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'StatusId is required' })
  statusId: number;
  @IsNotEmpty({ message: 'Label is required' })
  label: string;
}
