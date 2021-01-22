import { ExportOption } from './export-option';
import {
  Workbook,
  WorkbookSheet,
  WorkbookSheetColumn,
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
    private reportVehicle: string,
    private reportContent: string,
    private sheetName: string,
    private option?: ExportOption
  ) {}
  /**
   * Thêm tiêu đề cho file excel
   */
  public customExportExcel(e: ExcelExportEvent, grid: GridComponent): void {
    const workbook: Workbook = e.workbook;
    const sheet: WorkbookSheet = workbook.sheets[0];
    sheet.name = this.sheetName;
    const rows = sheet.rows;

    e.workbook.sheets[0].freezePane = null;
    // Chỉ lấy nhwungx cột dữ liệu, bỏ những cột command đi
    // CommandColumnComponent không có trường 'filterable' =))
    const numberColumns = grid.columnList.filter(
      (x: ColumnComponent) => !x.hidden && x.filterable !== undefined
    ).length;
    // Chỉnh độ rộng cột
    let index = 0;
    sheet.columns.forEach((column: WorkbookSheetColumn) => {
      if (index !== 0) {
        column.width = isNaN(column.width) ? 20 : column.width;
      }
      index++;
    });
    index = 0;
    // Chỉnh border  và căn giữa từng ô 1
    rows.forEach((row: WorkbookSheetRow) => {
      row.cells.forEach((cell: WorkbookSheetRowCell) => {
        cell.borderBottom = { color: '#666664', size: 1 };
        cell.borderLeft = { color: '#666664', size: 1 };
        cell.borderRight = { color: '#666664', size: 1 };
        cell.borderTop = { color: '#666664', size: 1 };
        cell.textAlign = 'center';
        cell.wrap = this.option?.wrap ?? true;
        cell.fontFamily = this.option?.fontFamily ?? 'Calibri';
        cell.fontSize = this.option?.fontSize ?? 14;
      });
    });
    // Cho dòng header căn giữa và đậm lên
    rows[0].height = 30;
    rows[0].cells.forEach((cell: WorkbookSheetRowCell) => {
      cell.bold = this.option?.headerBold ?? true;
      cell.textAlign = this.option?.headerAlignText ?? 'center';
      cell.verticalAlign = this.option?.headerVerticalAlignText ?? 'center';
      cell.fontSize = this.option?.headerFontSize ?? 17;
      cell.background = this.option?.headerBackground ?? '#ffffff';
      cell.color = this.option?.headerColor ?? '#000000';
    });
    // Cho dòng summary căn giữa và đậm lên
    rows[rows.length - 1].height = 30;
    rows[rows.length - 1].cells.forEach((cell: WorkbookSheetRowCell) => {
      cell.bold = this.option?.footerBold ?? true;
      cell.textAlign = this.option?.footerAlignText ?? 'center';
      cell.verticalAlign = this.option?.footerVerticalAlignText ?? 'center';
      cell.fontSize = this.option?.footerFontSize ?? 15;
      cell.background = this.option?.footerBackground ?? '#e3e3e3';
      cell.color = this.option?.footerColor ?? 'black';
    });
    // Thêm dòng nội dung tìm kiếm
    if (this.reportContent !== '') {
      rows.unshift({
        cells: [
          {
            colSpan: numberColumns,
          },
        ],
      });
      rows.unshift({
        cells: [
          {
            value: this.reportContent,
            colSpan: numberColumns,
            rowSpan: 1,
            textAlign: 'center',
            verticalAlign: 'center',
            bold: false,
            fontSize: this.option?.fontSize ?? 14,
            wrap: true,
          },
        ],
      });
    }

    // Thêm dòng xe / nhóm xe
    if (this.reportVehicle !== '') {
      rows.unshift({
        cells: [
          {
            value: this.reportVehicle,
            colSpan: numberColumns,
            rowSpan: 1,
            textAlign: 'center',
            verticalAlign: 'center',
            bold: false,
            fontSize: this.option?.fontSize ?? 14,
            wrap: true,
          },
        ],
      });
    }
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
          fontSize: this.option?.fontSize ?? 14,
          wrap: true,
        },
      ],
    });
    // Thêm dòng tiêu đề
    rows.unshift({
      cells: [],
    });
    rows.unshift({
      cells: [
        {
          value: this.reportTitle.toUpperCase(),
          colSpan: numberColumns,
          rowSpan: 2,
          textAlign: 'center',
          verticalAlign: 'center',
          bold: this.option?.titleBold ?? true,
          fontSize: this.option?.titlefontSize ?? 18,
          wrap: true,
          color: this.option?.titleColor ?? 'black',
        },
      ],
    });
    // const columnsHalfNumber = Math.round(numberColumns / 2) - 1;
    // rows.push({ cells: [] });
    // rows.push({
    //   cells: [
    //     {
    //       value: '        Phụ trách đơn vị'.toUpperCase(),
    //       colSpan: columnsHalfNumber,
    //       rowSpan: 2,
    //       textAlign: 'left',
    //       verticalAlign: 'center',
    //       bold: true,
    //       fontSize: 16,
    //       wrap: false,
    //     },
    //     {
    //       value: 'Người lập biểu             '.toUpperCase(),
    //       colSpan: numberColumns - columnsHalfNumber,
    //       rowSpan: 2,
    //       textAlign: 'right',
    //       verticalAlign: 'center',
    //       bold: true,
    //       fontSize: 16,
    //       wrap: false,
    //     },
    //   ],
    // });
  }

  public exportExcelFromServer(): void {}

  public exportExcelWithThirty(
    e: ExcelExportEvent,
    grid: GridComponent
  ): void {}
}
