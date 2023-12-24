import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTableDto } from 'src/table/dto/create-table.dto';
import { TableService } from 'src/table/table.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EditColumnDto } from 'src/table/dto/edit-column.dto';
import { CreateRowDto } from 'src/table/dto/create-row.dto';
import { EditCellDto } from 'src/table/dto/edit-cell.dto';
import { CreateColumnDto } from 'src/table/dto/create-column.dto';
import { UpdateTableDto } from 'src/table/dto/update-table.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createTable(@Request() req, @Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto, req.user.id);
  }

  @Get('/:tableId')
  @UseGuards(JwtAuthGuard)
  getTable(@Param('tableId') tableId) {
    return this.tableService.getTableById(tableId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateTable(@Body() updateTableDto: UpdateTableDto) {
    return this.tableService.updateTable(updateTableDto);
  }

  @Delete('/:tableId')
  @UseGuards(JwtAuthGuard)
  async deleteTable(@Param('tableId') tableId, @Res() res) {
    await this.tableService.deleteTable(tableId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/row')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createRow(@Body() createRowDto: CreateRowDto) {
    return this.tableService.createRow(createRowDto);
  }

  @Delete('/row/:rowId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteRow(@Param('rowId') rowId, @Res() res) {
    await this.tableService.deleteRow(rowId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  editColumn(@Body() editColumnDto: EditColumnDto) {
    return this.tableService.editColumn(editColumnDto);
  }

  @Post('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createColumn(@Body() createColumnDto: CreateColumnDto) {
    return await this.tableService.createColumn(createColumnDto);
  }

  @Delete('/column/:columnId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteColumn(@Param('columnId') columnId, @Res() res) {
    await this.tableService.deleteColumn(columnId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/cell')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  editCell(@Body() editCellDto: EditCellDto) {
    return this.tableService.editCell(editCellDto);
  }
}
