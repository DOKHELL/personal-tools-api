import { ColumnTypeEnum } from 'src/table/enums/column.enum';

export const defaultColumns = [
  { name: 'Name', type: ColumnTypeEnum.Text, orderIndex: 0 },
  { name: 'Links', type: ColumnTypeEnum.Text, orderIndex: 1 },
  { name: 'Status', type: ColumnTypeEnum.Status, orderIndex: 2 },
  { name: 'Type', type: ColumnTypeEnum.Text, orderIndex: 3 },
  { name: 'Info', type: ColumnTypeEnum.Text, orderIndex: 4 },
  { name: 'Spent', type: ColumnTypeEnum.Text, orderIndex: 5 },
  { name: 'Profit', type: ColumnTypeEnum.Text, orderIndex: 6 },
  { name: 'Date', type: ColumnTypeEnum.Date, orderIndex: 7 },
];
