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
import { UpdateStatusDto } from 'src/table/dto/update-status.dto';
import { CreateStatusDto } from 'src/table/dto/create-status.dto';

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
  getTable(@Request() req, @Param('tableId') tableId) {
    return this.tableService.getTableById(tableId, req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateTable(@Request() req, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.updateTable(updateTableDto, req.user.id);
  }

  @Delete('/:tableId')
  @UseGuards(JwtAuthGuard)
  async deleteTable(@Request() req, @Param('tableId') tableId, @Res() res) {
    await this.tableService.deleteTable(tableId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/row')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createRow(@Request() req, @Body() createRowDto: CreateRowDto) {
    return this.tableService.createRow(createRowDto, req.user.id);
  }

  @Delete('/row/:rowId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteRow(@Request() req, @Param('rowId') rowId, @Res() res) {
    await this.tableService.deleteRow(rowId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  editColumn(@Request() req, @Body() editColumnDto: EditColumnDto) {
    return this.tableService.editColumn(editColumnDto, req.user.id);
  }

  @Post('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createColumn(@Request() req, @Body() createColumnDto: CreateColumnDto) {
    return await this.tableService.createColumn(createColumnDto, req.user.id);
  }

  @Delete('/column/:columnId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteColumn(@Request() req, @Param('columnId') columnId, @Res() res) {
    await this.tableService.deleteColumn(columnId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/cell')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  editCell(@Request() req, @Body() editCellDto: EditCellDto) {
    return this.tableService.editCell(editCellDto, req.user.id);
  }

  @Get('/status/:columnId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getStatusesByColumnId(@Request() req, @Param('columnId') columnId) {
    return this.tableService.getStatusesByColumnId(columnId, req.user.id);
  }

  @Put('/status')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateStatus(@Request() req, @Body() updateStatusDto: UpdateStatusDto) {
    return this.tableService.updateStatus(updateStatusDto, req.user.id);
  }

  @Post('/status')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createStatus(@Request() req, @Body() createStatusDto: CreateStatusDto) {
    return this.tableService.createStatus(createStatusDto, req.user.id);
  }

  @Delete('/status/:statusId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteStatus(@Request() req, @Param('statusId') statusId, @Res() res) {
    await this.tableService.deleteStatus(statusId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
