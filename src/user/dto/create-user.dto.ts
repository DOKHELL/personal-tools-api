import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
