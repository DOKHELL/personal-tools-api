import { Body, Controller, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ required: true, type: CreateUserDto })
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
