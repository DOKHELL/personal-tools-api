import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password: pass } = createUserDto;
    const emailExist = await this.userRepository.findOne({ where: { email } });
    if (emailExist) throw new BadRequestException('Email already used');

    const nameExist = await this.userRepository.findOne({
      where: { username },
    });
    if (nameExist) throw new BadRequestException('Username already used');

    const salt = 6;
    const hash = await bcrypt.hash(pass, salt);
    const { password, ...user } = await this.userRepository.save({
      username: username,
      email: email,
      password: hash,
    });

    const token = this.jwtService.sign({
      email: user.email,
      username: user.username,
      id: user.id,
    });

    return { ...user, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }
}
