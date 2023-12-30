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
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { TableEntity } from 'src/table/entities/table.entity';
import { RowEntity } from 'src/table/entities/row.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { CellEntity } from 'src/table/entities/cell.entity';
import { StatusEntity } from 'src/table/entities/status.entity';
import { FullTableDto } from 'src/table/dto/get-tables.dto';

@ApiTags('table')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tables' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TableEntity, isArray: true })
  getTables(@Request() req) {
    return this.tableService.getTableByUserId(req.user.id);
  }

  @Get('/:tableId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get table by ID' })
  @ApiParam({ name: 'tableId', required: true, description: 'tableId identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FullTableDto })
  getTable(@Request() req, @Param('tableId') tableId) {
    return this.tableService.getTableById(tableId, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({ required: true, type: CreateTableDto })
  @ApiOperation({ summary: 'Create Table' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TableEntity })
  createTable(@Request() req, @Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto, req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update table by ID' })
  @ApiBody({ required: true, type: UpdateTableDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TableEntity })
  async updateTable(@Request() req, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.updateTable(updateTableDto, req.user.id);
  }

  @Delete('/:tableId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete table by ID' })
  @ApiParam({ name: 'tableId', required: true, description: 'tableId identifier' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  async deleteTable(@Request() req, @Param('tableId') tableId, @Res() res) {
    await this.tableService.deleteTable(tableId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/row')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create Row' })
  @ApiBody({ required: true, type: CreateRowDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: RowEntity })
  createRow(@Request() req, @Body() createRowDto: CreateRowDto) {
    return this.tableService.createRow(createRowDto, req.user.id);
  }

  @Delete('/row/:rowId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Delete Row' })
  @ApiParam({ name: 'rowId', required: true, description: 'rowId identifier' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  async deleteRow(@Request() req, @Param('rowId') rowId, @Res() res) {
    await this.tableService.deleteRow(rowId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create Column' })
  @ApiBody({ required: true, type: CreateColumnDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ColumnEntity })
  async createColumn(@Request() req, @Body() createColumnDto: CreateColumnDto) {
    return await this.tableService.createColumn(createColumnDto, req.user.id);
  }

  @Put('/column')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update Column' })
  @ApiBody({ required: true, type: EditColumnDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ColumnEntity })
  editColumn(@Request() req, @Body() editColumnDto: EditColumnDto) {
    return this.tableService.editColumn(editColumnDto, req.user.id);
  }

  @Delete('/column/:columnId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Delete Column' })
  @ApiParam({ name: 'columnId', required: true, description: 'columnId identifier' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  async deleteColumn(@Request() req, @Param('columnId') columnId, @Res() res) {
    await this.tableService.deleteColumn(columnId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/cell')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update Cell' })
  @ApiBody({ required: true, type: EditCellDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CellEntity })
  editCell(@Request() req, @Body() editCellDto: EditCellDto) {
    return this.tableService.editCell(editCellDto, req.user.id);
  }

  @Get('/status/:columnId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Get column statuses' })
  @ApiParam({ name: 'columnId', required: true, description: 'columnId identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: StatusEntity, isArray: true })
  getStatusesByColumnId(@Request() req, @Param('columnId') columnId) {
    return this.tableService.getStatusesByColumnId(columnId, req.user.id);
  }

  @Put('/status')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update column status' })
  @ApiBody({ required: true, type: UpdateStatusDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: StatusEntity })
  updateStatus(@Request() req, @Body() updateStatusDto: UpdateStatusDto) {
    return this.tableService.updateStatus(updateStatusDto, req.user.id);
  }

  @Post('/status')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create column status' })
  @ApiBody({ required: true, type: CreateStatusDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: StatusEntity })
  createStatus(@Request() req, @Body() createStatusDto: CreateStatusDto) {
    return this.tableService.createStatus(createStatusDto, req.user.id);
  }

  @Delete('/status/:statusId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Delete column status' })
  @ApiParam({ name: 'statusId', required: true, description: 'statusId identifier' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  async deleteStatus(@Request() req, @Param('statusId') statusId, @Res() res) {
    await this.tableService.deleteStatus(statusId, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
