import { IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty({ message: 'Table name is required' })
  name: string;
}
