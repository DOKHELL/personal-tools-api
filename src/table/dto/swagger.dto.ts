import { OmitType } from '@nestjs/swagger';
import { TableEntity } from 'src/table/entities/table.entity';
import { RowEntity } from 'src/table/entities/row.entity';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { CellEntity } from 'src/table/entities/cell.entity';
import { StatusEntity } from 'src/table/entities/status.entity';
import { CreateTableDto } from 'src/table/dto/create-table.dto';
import { EditColumnDto } from 'src/table/dto/edit-column.dto';
import { CreateRowDto } from 'src/table/dto/create-row.dto';
import { EditCellDto } from 'src/table/dto/edit-cell.dto';
import { CreateColumnDto } from 'src/table/dto/create-column.dto';
import { UpdateTableDto } from 'src/table/dto/update-table.dto';
import { UpdateStatusDto } from 'src/table/dto/update-status.dto';
import { CreateStatusDto } from 'src/table/dto/create-status.dto';

// Entity responses
export class TableResponse extends OmitType(TableEntity, ['columns', 'rows'] as const) {}
export class TableResponseFullData extends TableEntity {}
export class RowResponse extends RowEntity {}
export class ColumnResponse extends OmitType(ColumnEntity, ['statuses']) {}
export class CellResponse extends CellEntity {}
export class StatusResponse extends StatusEntity {}

// Params
export class CreateTableParams extends CreateTableDto {}
export class EditColumnParams extends EditColumnDto {}
export class CreateRowParams extends CreateRowDto {}
export class EditCellParams extends EditCellDto {}
export class CreateColumnParams extends CreateColumnDto {}
export class UpdateTableParams extends UpdateTableDto {}
export class UpdateStatusParams extends UpdateStatusDto {}
export class CreateStatusParams extends CreateStatusDto {}
