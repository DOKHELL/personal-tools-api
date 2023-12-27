import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TableEntity } from 'src/table/entities/table.entity';
import { CreateTableDto } from 'src/table/dto/create-table.dto';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { defaultColumns } from 'src/table/constants/table';
import { EditColumnDto } from 'src/table/dto/edit-column.dto';
import { RowEntity } from 'src/table/entities/row.entity';
import { CellEntity } from 'src/table/entities/cell.entity';
import { CreateRowDto } from 'src/table/dto/create-row.dto';
import { EditCellDto } from 'src/table/dto/edit-cell.dto';
import { ColumnTypeEnum } from 'src/table/enums/column.enum';
import { CreateColumnDto } from 'src/table/dto/create-column.dto';
import { UpdateTableDto } from 'src/table/dto/update-table.dto';
import { StatusEntity } from 'src/table/entities/status.entity';
import { CreateStatusDto } from 'src/table/dto/create-status.dto';
import { UpdateStatusDto } from 'src/table/dto/update-status.dto';
import { defaultStatuses } from 'src/table/constants/statuses';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
    @InjectRepository(RowEntity)
    private readonly rowRepository: Repository<RowEntity>,
    @InjectRepository(CellEntity)
    private readonly cellRepository: Repository<CellEntity>,
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTable(createTableDto: CreateTableDto, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const newTable = manager.create(TableEntity, {
        name: createTableDto.name,
        user: { id: userId },
      });
      const table = await manager.save(TableEntity, newTable);
      const _columns = defaultColumns.map((colData) =>
        manager.create(ColumnEntity, {
          name: colData.name,
          type: colData.type,
          width: 200,
          orderIndex: colData.orderIndex,
          table: table,
        }),
      );

      const columns = await manager.save(ColumnEntity, _columns);

      const statusColumn = columns.find(
        (col) => col.type === ColumnTypeEnum.Status,
      );

      const statuses = defaultStatuses.map((status) => {
        return manager.create(StatusEntity, {
          label: status.label,
          column: statusColumn,
        });
      });

      await manager.save(StatusEntity, statuses);

      const { user, ...result } = table;
      return result;
    });
  }

  async getTableById(tableId: string, userId: number) {
    const table = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.user', 'user')
      .leftJoinAndSelect('table.columns', 'column')
      .leftJoinAndSelect('table.rows', 'row')
      .leftJoinAndSelect('row.cells', 'cell')
      .leftJoin('cell.column', 'cellColumn')
      .where('table.id = :id', { id: tableId })
      .orderBy({
        'column.orderIndex': 'ASC',
        'row.id': 'ASC',
        'cellColumn.orderIndex': 'ASC',
      })
      .getOne();

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    const { user, ...result } = table;

    return result;
  }

  async updateTable({ tableId, name }: UpdateTableDto, userId: number) {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
      relations: ['user'],
    });

    if (!table) {
      throw new NotFoundException(`Table not found`);
    }

    if (table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    table.name = name;
    return await this.tableRepository.save(table);
  }

  async deleteTable(tableId: number, userId: number) {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
      relations: ['user'],
    });

    if (!table) {
      throw new NotFoundException(`Table not found`);
    }

    if (table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    await this.tableRepository.remove(table);
  }

  async createRow({ tableId }: CreateRowDto, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const _table = await manager.findOne(TableEntity, {
        where: { id: tableId },
        relations: ['user'],
      });

      if (!_table) {
        throw new NotFoundException(`Table not found`);
      }

      if (_table.user.id !== userId) {
        throw new UnauthorizedException('You have not permission');
      }

      const newRow = manager.create(RowEntity, {
        table: { id: tableId },
      });
      const savedRow = await manager.save(RowEntity, newRow);

      const columns = await manager.find(ColumnEntity, {
        where: { table: { id: tableId } },
        order: { orderIndex: 'ASC' },
      });

      const cells = columns.map((column) => {
        return manager.create(CellEntity, {
          row: savedRow,
          column,
          value: '',
        });
      });

      await manager.save(CellEntity, cells);
      const { table, ...result } = savedRow;
      return result;
    });
  }

  async deleteRow(rowId: number, userId: number) {
    const row = await this.rowRepository.findOne({
      where: { id: rowId },
      relations: ['table', 'table.user'],
    });

    if (!row) {
      throw new NotFoundException(`Row not found`);
    }

    if (row.table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    await this.rowRepository.remove(row);
  }

  async createColumn(
    { name, type, width, tableId }: CreateColumnDto,
    userId: number,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const isStatusColumn = type === ColumnTypeEnum.Status;
      const _table = await manager.findOne(TableEntity, {
        where: { id: tableId },
        relations: ['user'],
      });

      if (!_table) {
        throw new NotFoundException(`Table not found`);
      }

      if (_table.user.id !== userId) {
        throw new UnauthorizedException('You have not permission');
      }

      const columns = await manager.find(ColumnEntity, {
        where: { table: { id: tableId } },
        order: { orderIndex: 'ASC' },
      });

      const isColumnWithStatusExist = columns.some(
        (c) => c.type === ColumnTypeEnum.Status,
      );

      if (isStatusColumn && isColumnWithStatusExist) {
        throw new BadRequestException('Table can only have one status column');
      }

      const rows = await manager.find(RowEntity, {
        where: { table: { id: tableId } },
        order: { id: 'ASC' },
      });

      const newColumn = manager.create(ColumnEntity, {
        table: { id: tableId },
        type,
        name,
        width: width || 200,
        orderIndex: columns.length,
      });

      const savedColumn = await manager.save(ColumnEntity, newColumn);

      const cells = rows.map((row) => {
        return manager.create(CellEntity, {
          row: row,
          column: savedColumn,
          value: '',
        });
      });

      await manager.save(CellEntity, cells);

      if (isStatusColumn) {
        const statuses = defaultStatuses.map((status) => {
          return manager.create(StatusEntity, {
            label: status.label,
            column: savedColumn,
          });
        });

        await manager.save(StatusEntity, statuses);
      }

      const { table, ...result } = savedColumn;
      return result;
    });
  }

  async editColumn(data: EditColumnDto, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const { name, type, width, columnId, orderIndex } = data;
      const column = await manager.findOne(ColumnEntity, {
        where: { id: columnId },
        order: { orderIndex: 'ASC' },
        relations: ['table', 'table.user', 'table.columns'],
      });

      if (!column) {
        throw new NotFoundException('Column not found');
      }

      if (column.table.user.id !== userId) {
        throw new UnauthorizedException('You have not permission');
      }

      if (type && !Object.values(ColumnTypeEnum).includes(type)) {
        throw new BadRequestException('Type is not valid');
      }
      if (name) {
        column.name = name;
      }
      if (type && column.type !== type) {
        column.type = type;
        await this.resetAllCellsByColumnId(columnId, manager);
      }
      if (width) {
        column.width = width;
      }
      if (orderIndex >= 0) {
        column.orderIndex = orderIndex;
        await this.moveColumn(orderIndex, columnId, manager);
      }

      return await manager.save(ColumnEntity, column);
    });
  }

  async deleteColumn(columnId: number, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const column = await manager.findOne(ColumnEntity, {
        where: { id: columnId },
        relations: ['table', 'table.columns', 'table.user'],
      });

      if (!column) {
        throw new NotFoundException(`Column not found`);
      }

      if (column.table.user.id !== userId) {
        throw new UnauthorizedException('You have not permission');
      }

      await manager.remove(ColumnEntity, column);

      const remainingColumns = column.table.columns
        .filter((c) => c.id !== Number(columnId))
        .sort((c, n) => c.orderIndex - n.orderIndex)
        .map((c, index) => {
          c.orderIndex = index;
          return c;
        });
      return await manager.save(ColumnEntity, remainingColumns);
    });
  }

  async moveColumn(
    newOrderIndex: number,
    columnId: number,
    manager: EntityManager,
  ) {
    const column = await manager.findOne(ColumnEntity, {
      where: { id: columnId },
      relations: ['table', 'table.columns'],
    });
    const columns = column.table.columns;
    const currentIndex = column.orderIndex;

    if (newOrderIndex < 0 || newOrderIndex >= columns.length) {
      throw new BadRequestException('Invalid new index');
    }
    const updatedColumns = column.table.columns.map((c) => {
      if (c.id === column.id) c.orderIndex = newOrderIndex;
      else {
        if (currentIndex < newOrderIndex) {
          if (c.orderIndex > currentIndex && c.orderIndex <= newOrderIndex) {
            c.orderIndex--;
          }
        } else if (currentIndex > newOrderIndex) {
          if (c.orderIndex < currentIndex && c.orderIndex >= newOrderIndex) {
            c.orderIndex++;
          }
        }
      }
      return c;
    });
    await manager.save(ColumnEntity, updatedColumns);
  }

  async editCell({ cellId, value }: EditCellDto, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const cell = await manager.findOne(CellEntity, {
        where: { id: cellId },
        relations: ['column', 'column.table', 'column.table.user'],
      });
      if (!cell) {
        throw new NotFoundException(`Cell not found`);
      }

      if (cell.column.table.user.id !== userId) {
        throw new UnauthorizedException('You have not permission');
      }

      const columnType = cell.column.type;
      const statusList = await manager.find(StatusEntity, {
        where: { column: { id: cell.column.id } },
      });
      const statusLabels = statusList.map((status) => status.label);

      switch (columnType) {
        case ColumnTypeEnum.Status:
          const isValid = statusLabels.includes(value as string);
          if (!isValid)
            throw new BadRequestException('Value is not valid for column type');
          cell.value = value;
          break;
        case ColumnTypeEnum.Date:
          const date = new Date(value);
          const isValidDate = date instanceof Date && !isNaN(date.getTime());
          if (!isValidDate) throw new BadRequestException('Date is not valid');
          cell.value = value;
          break;
        default:
          cell.value = value;
      }

      const { column, ...result } = await manager.save(CellEntity, cell);
      return result;
    });
  }

  async resetAllCellsByColumnId(columnId: number, manager: EntityManager) {
    const cells = await manager.find(CellEntity, {
      where: { column: { id: columnId } },
    });

    const resetCells = cells.map((cell) => {
      cell.value = '';
      return cell;
    });

    await manager.save(CellEntity, resetCells);
  }

  async getStatusesByColumnId(columnId: number, userId: number) {
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: ['statuses', 'table', 'table.user'],
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (column.table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    return column.statuses.sort((a, b) => a.id - b.id);
  }

  async createStatus({ columnId, label }: CreateStatusDto, userId: number) {
    const column_ = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: ['table', 'table.user'],
    });

    if (!column_) {
      throw new NotFoundException('Column not found');
    }

    if (column_.table.user.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    const newStatus = this.statusRepository.create({ label, column: column_ });

    const status = await this.statusRepository.save(newStatus);

    const { column, ...result } = status;

    return result;
  }

  async updateStatus({ statusId, label }: UpdateStatusDto, userId: number) {
    const status = await this.statusRepository.findOne({
      where: { id: statusId },
      relations: ['column', 'column.table', 'column.table.user'],
    });

    if (!status) {
      throw new NotFoundException('Status not found');
    }

    if (status.column?.table?.user?.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    status.label = label;

    const newStatus = await this.statusRepository.save(status);
    const { column, ...result } = newStatus;

    return result;
  }

  async deleteStatus(statusId: number, userId: number) {
    const status = await this.statusRepository.findOne({
      where: { id: statusId },
      relations: [
        'column',
        'column.statuses',
        'column.table',
        'column.table.user',
      ],
    });

    if (!status) {
      throw new NotFoundException('Status not found');
    }

    if (status.column?.table?.user?.id !== userId) {
      throw new UnauthorizedException('You have not permission');
    }

    const statuses = status?.column?.statuses;

    if (statuses?.length <= 2) {
      throw new BadRequestException('Column must have at least 2 statuses');
    }

    return await this.statusRepository.remove(status);
  }
}
