import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ description: 'Username' })
  username: string;
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email' })
  email: string;
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'Password' })
  password: string;
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'Password' })
  passwordConfirm: string;
}
