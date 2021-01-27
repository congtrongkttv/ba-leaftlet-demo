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
import { Observable, zip } from 'rxjs';
import { saveAs } from '@progress/kendo-file-saver';

export class ExportHelper {
  constructor(
    private reportTitle: string,
    private reportDate: string,
    private reportVehicle: string,
    private reportContent: string,
    private sheetName: string,
    private reportList: any,
    private baseComponent: any,
    private option?: ExportOption
  ) {}

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
    if (this.option?.isSummary) {
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
    }
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
  }

  public customExportExcelMasterDetail(
    args: ExcelExportEvent,
    grid: GridComponent
  ): void {
    // Prevent automatically saving the file. We will save it manually after we fetch and add the details
    args.preventDefault();
    const observables = [];

    const workbook: Workbook = args.workbook;
    const sheet: WorkbookSheet = workbook.sheets[0];
    sheet.name = this.sheetName;
    const rows = sheet.rows;

    // Chỉ lấy nhwungx cột dữ liệu, bỏ những cột command đi
    // CommandColumnComponent không có trường 'filterable' =))
    const numberColumnsMaster = grid.columnList.filter(
      (x: ColumnComponent) => !x.hidden && x.filterable !== undefined
    ).length;
    const numberColumnsDetail = this.baseComponent.baseManager.columnDetail
      .length;
    const numberColumns =
      numberColumnsMaster > numberColumnsDetail
        ? numberColumnsMaster
        : numberColumnsDetail + 1;

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
        cell.background = '#6be5f2';
      });
    });
    if (numberColumnsMaster <= numberColumnsDetail) {
      let cols = numberColumnsDetail - numberColumnsMaster + 1;
      for (let idx = 0; idx < cols; idx++) {
        rows.forEach((row: WorkbookSheetRow) => {
          row.cells.push({
            borderBottom: { color: '#666664', size: 1 },
            borderLeft: { color: '#666664', size: 1 },
            borderRight: { color: '#666664', size: 1 },
            borderTop: { color: '#666664', size: 1 },
            textAlign: 'center',
            wrap: this.option?.wrap ?? true,
            fontFamily: this.option?.fontFamily ?? 'Calibri',
            fontSize: this.option?.fontSize ?? 14,
            background: '#6be5f2',
          });
        });
      }
    }

    // Get the default header styles.
    // Aternatively set custom styles for the details
    // https://www.telerik.com/kendo-angular-ui/components/excelexport/api/WorkbookSheetRowCell/
    const headerOptions = rows[0].cells[0];

    // const data = this.allCategories;
    const data = this.reportList.data;

    // Fetch the data for all details
    // tslint:disable-next-line: prefer-for-of
    for (let idx = 0; idx < data.length; idx++) {
      observables.push(this.baseComponent.getDataDetailMaster(data[idx]));
    }

    // tslint:disable-next-line: deprecation
    zip.apply(Observable, observables).subscribe((result: any[][]) => {
      // add the detail data to the generated master sheet rows
      // loop backwards in order to avoid changing the rows index
      for (let idx = result.length - 1; idx >= 0; idx--) {
        const detail = <any>result[idx];
        const numberRowDetail = detail.data.length;
        // add the detail data
        for (let i = detail.data.length - 1; i >= 0; i--) {
          const dataDetail = detail.data[i];
          const cellDetail: any[] = [];
          if (i === 0) {
            cellDetail.push({ rowSpan: i === 0 ? numberRowDetail : 0 });
          }
          this.baseComponent.baseManager.columnDetail.forEach((element) => {
            cellDetail.push({
              value: dataDetail[element.field],
              textAlign: 'center',
              verticalAlign: 'center',
              borderBottom: { color: '#666664', size: 1 },
              borderLeft: { color: '#666664', size: 1 },
              borderRight: { color: '#666664', size: 1 },
              borderTop: { color: '#666664', size: 1 },
            });
          });
          if (numberColumnsMaster > numberColumnsDetail) {
            let cols = numberColumnsMaster - numberColumnsDetail - 1;
            for (let idx = 0; idx < cols; idx++) {
              cellDetail.push({
                textAlign: 'center',
                verticalAlign: 'center',
                borderBottom: { color: '#666664', size: 1 },
                borderLeft: { color: '#666664', size: 1 },
                borderRight: { color: '#666664', size: 1 },
                borderTop: { color: '#666664', size: 1 },
              });
            }
          }
          rows.splice(idx + 2, 0, {
            cells: cellDetail,
          });
        }

        // add the detail header
        const cellHeader: any[] = [];
        cellHeader.push({});
        this.baseComponent.baseManager.columnDetail.forEach((element) => {
          cellHeader.push({
            value: element.title,
            rowSpan: 1,
            textAlign: 'center',
            verticalAlign: 'center',
            bold: true,
            fontSize: this.option?.fontSize ?? 13,
            wrap: true,
            background: this.option?.headerBackground ?? '#d1d1d1',
            borderBottom: { color: '#666664', size: 1 },
            borderLeft: { color: '#666664', size: 1 },
            borderRight: { color: '#666664', size: 1 },
            borderTop: { color: '#666664', size: 1 },
          });
        });
        if (numberColumnsMaster > numberColumnsDetail) {
          let cols = numberColumnsMaster - numberColumnsDetail - 1;
          for (let idx = 0; idx < cols; idx++) {
            cellHeader.push({
              background: this.option?.headerBackground ?? '#d1d1d1',
              borderBottom: { color: '#666664', size: 1 },
              borderLeft: { color: '#666664', size: 1 },
              borderRight: { color: '#666664', size: 1 },
              borderTop: { color: '#666664', size: 1 },
            });
          }
        }
        rows.splice(idx + 2, 0, {
          cells: cellHeader,
        });
      }

      //#region  set title and header
      args.workbook.sheets[0].freezePane = null;

      // Chỉnh độ rộng cột
      let index = 0;
      sheet.columns.forEach((column: WorkbookSheetColumn) => {
        if (index !== 0) {
          column.width = isNaN(column.width) ? 25 : column.width;
        }
        index++;
      });
      index = 0;

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
      if (this.option?.isSummary) {
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
      }
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
              background: this.option?.headerBackground ?? '#ffffff',
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
      //#endregion  set title
      // create a Workbook and save the generated data URL
      // https://www.telerik.com/kendo-angular-ui/components/excelexport/api/Workbook/
      new Workbook(workbook).toDataURL().then((dataUrl: string) => {
        // https://www.telerik.com/kendo-angular-ui/components/filesaver/
        saveAs(dataUrl, 'Products.xlsx');
      });
    });
  }

  public exportExcelFromServer(): void {}

  public exportExcelWithThirty(
    e: ExcelExportEvent,
    grid: GridComponent
  ): void {}
}
