import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
import { CellStatusEnum } from 'src/table/enums/cell.enum';
import { CreateColumnDto } from 'src/table/dto/create-column.dto';
import { UpdateTableDto } from 'src/table/dto/update-table.dto';

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
    private readonly dataSource: DataSource,
  ) {}

  async createTable(createTableDto: CreateTableDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newTable = queryRunner.manager.create(TableEntity, {
        name: createTableDto.name,
        user: { id: userId },
      });
      const savedTable = await queryRunner.manager.save(TableEntity, newTable);

      const columns = defaultColumns.map((colData) =>
        queryRunner.manager.create(ColumnEntity, {
          name: colData.name,
          type: colData.type,
          width: 200,
          orderIndex: colData.orderIndex,
          table: savedTable,
        }),
      );

      await queryRunner.manager.save(ColumnEntity, columns);
      await queryRunner.commitTransaction();
      const { user, ...table } = savedTable;
      return table;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getTableById(tableId: string) {
    const table = await this.tableRepository
      .createQueryBuilder('table')
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

    return table;
  }

  async updateTable({ tableId, name }: UpdateTableDto) {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException(`Table not found`);
    }
    table.name = name;
    return await this.tableRepository.save(table);
  }

  async deleteTable(tableId: number) {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException(`Table not found`);
    }

    await this.tableRepository.remove(table);
  }

  async createRow({ tableId }: CreateRowDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newRow = queryRunner.manager.create(RowEntity, {
        table: { id: tableId },
      });
      const savedRow = await queryRunner.manager.save(RowEntity, newRow);

      const columns = await queryRunner.manager.find(ColumnEntity, {
        where: { table: { id: tableId } },
        order: { orderIndex: 'ASC' },
      });

      const cells = columns.map((column) => {
        return queryRunner.manager.create(CellEntity, {
          row: savedRow,
          column,
          value: '',
        });
      });

      await queryRunner.manager.save(CellEntity, cells);
      await queryRunner.commitTransaction();
      const { table, ...result } = savedRow;
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteRow(rowId: number) {
    const row = await this.rowRepository.findOne({
      where: { id: rowId },
    });

    if (!row) {
      throw new NotFoundException(`Row not found`);
    }

    await this.rowRepository.remove(row);
  }

  async editColumn(data: EditColumnDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { name, type, width, columnId, orderIndex } = data;
      const column = await queryRunner.manager.findOne(ColumnEntity, {
        where: { id: columnId },
        order: { orderIndex: 'ASC' },
      });

      if (!column) {
        throw new NotFoundException('Column not found');
      }

      if (type && !Object.values(ColumnTypeEnum).includes(type)) {
        throw new BadRequestException('Type is not valid');
      }

      if (name) column.name = name;
      if (type) column.type = type;
      if (width) column.width = width;
      if (orderIndex >= 0) column.orderIndex = orderIndex;
      if (orderIndex >= 0)
        await this.moveColumn(orderIndex, columnId, queryRunner);

      const result = await queryRunner.manager.save(ColumnEntity, column);
      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async moveColumn(newOrderIndex: number, columnId: number, queryRunner) {
    const column = await queryRunner.manager.findOne(ColumnEntity, {
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
    await queryRunner.manager.save(ColumnEntity, updatedColumns);
  }

  async deleteColumn(columnId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const column = await queryRunner.manager.findOne(ColumnEntity, {
        where: { id: columnId },
        relations: ['table', 'table.columns'],
      });

      if (!column) {
        throw new NotFoundException(`Column not found`);
      }

      await queryRunner.manager.remove(ColumnEntity, column);

      const remainingColumns = column.table.columns
        .filter((c) => c.id !== Number(columnId))
        .sort((c, n) => c.orderIndex - n.orderIndex)
        .map((c, index) => {
          c.orderIndex = index;
          return c;
        });
      await queryRunner.manager.save(ColumnEntity, remainingColumns);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async createColumn({ name, type, width, tableId }: CreateColumnDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const columns = await queryRunner.manager.find(ColumnEntity, {
        where: { table: { id: tableId } },
        order: { orderIndex: 'ASC' },
      });

      const rows = await queryRunner.manager.find(RowEntity, {
        where: { table: { id: tableId } },
        order: { id: 'ASC' },
      });

      const newColumn = queryRunner.manager.create(ColumnEntity, {
        table: { id: tableId },
        type,
        name,
        width: width || 200,
        orderIndex: columns.length,
      });
      const savedColumn = await queryRunner.manager.save(
        ColumnEntity,
        newColumn,
      );

      const cells = rows.map((row) => {
        return queryRunner.manager.create(CellEntity, {
          row: row,
          column: savedColumn,
          value: '',
        });
      });

      await queryRunner.manager.save(CellEntity, cells);
      await queryRunner.commitTransaction();

      return savedColumn;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async editCell({ cellId, value }: EditCellDto) {
    const cell = await this.cellRepository.findOne({
      where: { id: cellId },
      relations: ['column'],
    });
    if (!cell) {
      throw new NotFoundException(`Cell not found`);
    }
    const columnType = cell.column.type;
    const statusList = Object.values(CellStatusEnum);

    switch (columnType) {
      case ColumnTypeEnum.Status:
        const isValid = statusList.includes(value as CellStatusEnum);
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

    const { column, ...result } = await this.cellRepository.save(cell);
    return result;
  }
}
