import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from 'src/table/entities/table.entity';
import { CreateTableDto } from 'src/table/dto/create-table.dto';
import { ColumnEntity } from 'src/table/entities/column.entity';
import { defaultColumns } from 'src/constants/table';
import { MoveColumnDto } from 'src/table/dto/move-column.dto';
import { RowEntity } from 'src/table/entities/row.entity';
import { CellEntity } from 'src/table/entities/cell.entity';
import { CreateRowDto } from 'src/table/dto/create-row.dto';

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
  ) {}

  async createTable(createTableDto: CreateTableDto, userId: number) {
    const newTable = this.tableRepository.create({
      name: createTableDto.name,
      user: { id: userId },
    });
    const savedTable = await this.tableRepository.save(newTable);

    const columns = defaultColumns.map((colData) =>
      this.columnRepository.create({
        name: colData.name,
        type: colData.type,
        orderIndex: colData.orderIndex,
        table: savedTable,
      }),
    );

    await this.columnRepository.save(columns);
    const { user, ...table } = savedTable;
    return table;
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
      throw new NotFoundException('Table with not found');
    }

    return table;
  }

  async createRow({ tableId }: CreateRowDto) {
    const newRow = this.rowRepository.create({ table: { id: tableId } });
    const savedRow = await this.rowRepository.save(newRow);

    const columns = await this.columnRepository.find({
      where: { table: { id: tableId } },
      order: {
        orderIndex: 'ASC',
      },
    });

    const cells = columns.map((column) => {
      return this.cellRepository.create({
        row: savedRow,
        column,
        value: '',
      });
    });

    await this.cellRepository.save(cells);

    return savedRow;
  }

  async moveColumn({ columnId, newOrderIndex }: MoveColumnDto) {
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: ['table', 'table.columns'],
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const columns = column.table.columns;
    const currentIndex = column.orderIndex;

    if (newOrderIndex < 0 || newOrderIndex >= columns.length) {
      throw new BadRequestException('Invalid new index');
    }

    const updatedColumns = column.table.columns.map((c) => {
      if (c.id === columnId) c.orderIndex = newOrderIndex;
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
    await this.columnRepository.save(updatedColumns);
  }
}
