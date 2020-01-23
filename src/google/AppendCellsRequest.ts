import { RowData } from "./RowData";

export interface AppendCellsRequest {
  sheetId: number,
  rows: RowData[],
  fields: string
}