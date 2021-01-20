import { BaseManager } from '../BLL/BaseManager/BaseManager';
import {
  Workbook,
  WorkbookSheet,
  WorkbookSheetRow,
  WorkbookSheetRowCell,
} from '@progress/kendo-angular-excel-export';
import {
  CellComponent,
  ColumnComponent,
  CommandColumnComponent,
  ExcelExportEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';

export class ExportHelper {
  constructor(
    private reportTitle: string,
    private reportDate: string,
    private reportVehicle: string
  ) {}
  /**
   * Thêm tiêu đề cho file excel
   */
  public customExportExcel(e: ExcelExportEvent, grid: GridComponent): void {
    const workbook: Workbook = e.workbook;
    const sheet: WorkbookSheet = workbook.sheets[0];
    const rows = sheet.rows;

    e.workbook.sheets[0].freezePane = null;
    // Chỉ lấy nhwungx cột dữ liệu, bỏ những cột command đi
    // CommandColumnComponent không có trường 'filterable' =))
    const numberColumns = grid.columnList.filter(
      (x: ColumnComponent) => !x.hidden && x.filterable !== undefined
    ).length;
    rows.forEach((row: WorkbookSheetRow) => {
      row.cells.forEach((cell: WorkbookSheetRowCell) => {
        cell.borderBottom = { color: '#666664', size: 1 };
        cell.borderLeft = { color: '#666664', size: 1 };
        cell.borderRight = { color: '#666664', size: 1 };
        cell.borderTop = { color: '#666664', size: 1 };
      });
    });
    // Cho dòng header căn giữa và đậm lên
    rows[0].height = 30;
    rows[0].cells.forEach((cell: WorkbookSheetRowCell) => {
      cell.bold = true;
      cell.textAlign = 'center';
      cell.verticalAlign = 'center';
      cell.fontSize = 15;
    });
    // Cho dòng summary căn giữa và đậm lên
    rows[rows.length - 1].height = 30;
    rows[rows.length - 1].cells.forEach((cell: WorkbookSheetRowCell) => {
      cell.bold = true;
      cell.textAlign = 'center';
      cell.verticalAlign = 'center';
      cell.fontSize = 15;
    });

    // Thêm dòng xe / nhóm xe
    rows.unshift({ cells: [] });
    rows.unshift({
      cells: [
        {
          value: this.reportVehicle,
          colSpan: numberColumns,
          rowSpan: 1,
          textAlign: 'center',
          verticalAlign: 'center',
          bold: false,
          fontSize: 12,
          fontFamily: 'Times New Roman',
          wrap: true,
        },
      ],
    });
    // Thêm dòng ngày tháng
    rows.unshift({
      cells: [
        {
          value: this.reportDate,
          colSpan: numberColumns,
          rowSpan: 1,
          textAlign: 'center',
          verticalAlign: 'center',
          bold: false,
          fontSize: 12,
          fontFamily: 'Times New Roman',
          wrap: true,
        },
      ],
    });
    // Thêm dòng tiêu đề
    rows.unshift({ cells: [] });
    rows.unshift({
      cells: [
        {
          value: this.reportTitle.toUpperCase(),
          colSpan: numberColumns,
          rowSpan: 2,
          textAlign: 'center',
          verticalAlign: 'center',
          bold: true,
          fontSize: 16,
          fontFamily: 'Times New Roman',
          wrap: true,
        },
      ],
    });
  }
}
