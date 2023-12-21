import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTableDto } from 'src/table/dto/create-table.dto';
import { TableService } from 'src/table/table.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MoveColumnDto } from 'src/table/dto/move-column.dto';
import { CreateRowDto } from 'src/table/dto/create-row.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Request() req, @Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto, req.user.id);
  }

  @Post('/create-row')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createRow(@Body() createRowDto: CreateRowDto) {
    return this.tableService.createRow(createRowDto);
  }

  @Post('move-column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  moveColumn(@Body() moveColumnDto: MoveColumnDto) {
    return this.tableService.moveColumn(moveColumnDto);
  }

  @Get('/:tableId')
  @UseGuards(JwtAuthGuard)
  getTable(@Param('tableId') tableId) {
    return this.tableService.getTableById(tableId);
  }
}
