import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/auth/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) throw new BadRequestException('Email or password is not valid');
    const isPasswordMatch = await bcrypt.compare(pass, user?.password);
    if (!user || !isPasswordMatch) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(user: IUser) {
    const { username, id, email } = user;
    const payload = { username, id, email };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
