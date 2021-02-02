import {
  Workbook,
  WorkbookSheet,
  WorkbookSheetColumn,
  WorkbookSheetRow,
  WorkbookSheetRowCell,
} from '@progress/kendo-angular-excel-export';
import {
  ColumnComponent,
  ExcelExportEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { Observable, zip } from 'rxjs';
import { saveAs } from '@progress/kendo-file-saver';
import { ExportOption, ExportExcelOption } from './export-option';
import { ExportStyleOption } from './export-style-option';

export class ExportHelper {
  constructor(
    private stypeOption?: ExportStyleOption,
    private option?: ExportExcelOption
  ) {}
  /**
   * Xuất excel
   * @param e event xuất excel
   * @param grid đối tượng cần xuất excel
   */
  public customExportExcel(e: ExcelExportEvent, grid: GridComponent): void {
    const workbook: Workbook = e.workbook;
    const sheet: WorkbookSheet = workbook.sheets[0];
    sheet.name = this.option?.Template.SheetName;
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
        this.setStyleCellCommon(cell);
      });
    });
    // Cho dòng header căn giữa và đậm lên
    rows[0].height = 30;
    rows[0].cells.forEach((cell: WorkbookSheetRowCell) => {
      this.setStyleCellHeader(cell);
    });
    // Cho dòng header căn giữa và đậm lên
    if (this.option?.Template.isGroupHeader) {
      rows[1].height = 30;
      rows[1].cells.forEach((cell: WorkbookSheetRowCell) => {
        this.setStyleCellHeader(cell);
      });
    }
    if (this.option?.Template.isSummary) {
      // Cho dòng summary căn giữa và đậm lên
      rows[rows.length - 1].height = 30;
      rows[rows.length - 1].cells.forEach((cell: WorkbookSheetRowCell) => {
        this.setStyleCellSummary(cell);
      });
    }

    // Thêm dòng nội dung tìm kiếm
    if (this.option?.Template.reportContent !== '') {
      rows.unshift({
        cells: [
          {
            colSpan: numberColumns,
          },
        ],
      });
      rows.unshift({
        cells: [
          this.createCell(
            this.option?.Template.reportContent,
            numberColumns,
            1,
            'center',
            'center',
            false,
            this.stypeOption?.fontSize ?? 14,
            true,
            'black',
            this.stypeOption?.fontFamily ?? 'Times New Roman'
          ),
        ],
      });
    }

    // Thêm dòng xe / nhóm xe
    if (this.option?.Template.ReportSubtitleLevel2 !== '') {
      rows.unshift({
        cells: [
          this.createCell(
            this.option?.Template.ReportSubtitleLevel2,
            numberColumns,
            1,
            'center',
            'center',
            false,
            this.stypeOption?.fontSize ?? 14,
            true,
            'black',
            this.stypeOption?.fontFamily ?? 'Times New Roman'
          ),
        ],
      });
    }
    // Thêm dòng ngày tháng
    rows.unshift({
      cells: [
        this.createCell(
          this.option?.Template.ReportSubtitleLevel1,
          numberColumns,
          1,
          'center',
          'center',
          false,
          this.stypeOption?.fontSize ?? 14,
          true,
          'black',
          this.stypeOption?.fontFamily ?? 'Times New Roman'
        ),
      ],
    });
    // Thêm dòng tiêu đề
    rows.unshift({
      cells: [],
    });
    rows.unshift({
      cells: [
        this.createCell(
          this.option?.Template.ReportTitle.toUpperCase(),
          numberColumns,
          2,
          'center',
          'center',
          this.stypeOption?.titleBold ?? true,
          this.stypeOption?.titlefontSize ?? 18,
          true,
          this.stypeOption?.titleColor ?? 'black',
          this.stypeOption?.fontFamily ?? 'Times New Roman'
        ),
      ],
    });

    // new Workbook(workbook).toDataURL().then((dataUrl: string) => {
    //   // https://www.telerik.com/kendo-angular-ui/components/filesaver/
    //   const reportName = this.option.reportName;
    //   saveAs(dataUrl, 'a.xlsx');
    // });
  }
  /**
   * Xuất excel với master detail
   * @param e event xuất excel
   * @param grid đối tượng cần xuất excel
   */
  public customExportExcelMasterDetail(
    args: ExcelExportEvent,
    grid: GridComponent
  ): void {
    // Prevent automatically saving the file. We will save it manually after we fetch and add the details
    args.preventDefault();
    const observables = [];
    const workbook: Workbook = args.workbook;
    const sheet: WorkbookSheet = workbook.sheets[0];
    sheet.name = this.option?.Template.SheetName;
    const rows = sheet.rows;

    // Lấy số cột của grid để merge dòng title
    // CommandColumnComponent không có trường 'filterable' =))
    const numberColumnsMaster = grid.columnList.filter(
      (x: ColumnComponent) => !x.hidden && x.filterable !== undefined
    ).length;
    const numberColumnsDetail = this.option?.Template.baseComponent.baseManager
      .columnDetail.length;
    const numberColumns =
      numberColumnsMaster > numberColumnsDetail
        ? numberColumnsMaster
        : numberColumnsDetail + 1;

    // Chỉnh border  và căn giữa từng ô 1 trước khi add phần detail và title vào
    rows.forEach((row: WorkbookSheetRow) => {
      row.cells.forEach((cell: WorkbookSheetRowCell) => {
        cell.borderBottom = { color: '#666664', size: 1 };
        cell.borderLeft = { color: '#666664', size: 1 };
        cell.borderRight = { color: '#666664', size: 1 };
        cell.borderTop = { color: '#666664', size: 1 };
        cell.textAlign = 'center';
        cell.wrap = this.stypeOption?.wrap ?? true;
        cell.fontFamily = this.stypeOption?.fontFamily ?? 'Times New Roman';
        cell.fontSize = this.stypeOption?.fontSize ?? 14;
      });
    });

    // Nếu lưới master ít cột hơn thì append cột vào cho bằng với lưới detail
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
            wrap: this.stypeOption?.wrap ?? true,
            fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
            fontSize: this.stypeOption?.fontSize ?? 14,
          });
        });
      }
    }

    // Get the default header styles.
    // Aternatively set custom styles for the details
    // https://www.telerik.com/kendo-angular-ui/components/excelexport/api/WorkbookSheetRowCell/
    const headerOptions = rows[0].cells[0];

    // const data = this.allCategories;
    const data = this.option?.Template.reportList.data;

    // Lấy dữ liệu chi tiết cho lưới detail
    // tslint:disable-next-line: prefer-for-of
    for (let idx = 0; idx < data.length; idx++) {
      observables.push(
        this.option?.Template.baseComponent.getDataDetailMaster(data[idx])
      );
    }

    // tslint:disable-next-line: deprecation
    zip.apply(Observable, observables).subscribe((result: any[][]) => {
      // add the detail data to the generated master sheet rows
      // loop backwards in order to avoid changing the rows index
      for (let idx = result.length - 1; idx >= 0; idx--) {
        const detail = <any>result[idx];
        // Số dòng dữ liệu của lưới detail ứng với từng dòng của lưới master
        const numberRowDetail = detail.data.length;
        // add the detail data
        rows.splice(idx + 2, 0, {
          cells: [{}],
        });
        for (let i = detail.data.length - 1; i >= 0; i--) {
          const dataDetail = detail.data[i];
          const cellDetail: any[] = [];
          if (i === 0) {
            cellDetail.push({ rowSpan: i === 0 ? numberRowDetail : 0 });
          }

          this.option?.Template.baseComponent.baseManager.columnDetail.forEach(
            (element) => {
              cellDetail.push({
                value: dataDetail[element.field],
                textAlign: 'center',
                verticalAlign: 'center',
                borderBottom: { color: '#666664', size: 1 },
                borderLeft: { color: '#666664', size: 1 },
                borderRight: { color: '#666664', size: 1 },
                borderTop: { color: '#666664', size: 1 },
                fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
              });
            }
          );
          // Nếu lưới detail ít cột hơn thì append cột vào cho bằng với lưới master
          if (numberColumnsMaster > numberColumnsDetail) {
            const cols = numberColumnsMaster - numberColumnsDetail - 1;
            for (let j = 0; j < cols; j++) {
              cellDetail.push({
                textAlign: 'center',
                verticalAlign: 'center',
                borderBottom: { color: '#666664', size: 1 },
                borderLeft: { color: '#666664', size: 1 },
                borderRight: { color: '#666664', size: 1 },
                borderTop: { color: '#666664', size: 1 },
                fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
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
        this.option?.Template.baseComponent.baseManager.columnDetail.forEach(
          (element) => {
            cellHeader.push({
              value: element.title,
              rowSpan: 1,
              textAlign: 'center',
              verticalAlign: 'center',
              bold: true,
              fontSize: this.stypeOption?.fontSize ?? 13,
              wrap: true,
              background: this.stypeOption?.headerBackground ?? '#d1d1d1',
              borderBottom: { color: '#666664', size: 1 },
              borderLeft: { color: '#666664', size: 1 },
              borderRight: { color: '#666664', size: 1 },
              borderTop: { color: '#666664', size: 1 },
              fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
            });
          }
        );
        // Nếu lưới detail ít cột hơn thì append cột vào cho bằng với lưới master
        if (numberColumnsMaster > numberColumnsDetail) {
          const cols = numberColumnsMaster - numberColumnsDetail - 1;
          for (let i = 0; i < cols; i++) {
            cellHeader.push({
              background: this.stypeOption?.headerBackground ?? '#d1d1d1',
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
        rows.splice(idx + 2, 0, {
          cells: [{}],
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
        cell.bold = this.stypeOption?.headerBold ?? true;
        cell.textAlign = this.stypeOption?.headerAlignText ?? 'center';
        cell.verticalAlign =
          this.stypeOption?.headerVerticalAlignText ?? 'center';
        cell.fontSize = this.stypeOption?.headerFontSize ?? 17;
        cell.background = this.stypeOption?.headerBackground ?? '#ffffff';
        cell.color = this.stypeOption?.headerColor ?? '#000000';
      });
      if (this.option?.Template.isSummary) {
        // Cho dòng summary căn giữa và đậm lên
        rows[rows.length - 1].height = 30;
        rows[rows.length - 1].cells.forEach((cell: WorkbookSheetRowCell) => {
          cell.bold = this.stypeOption?.footerBold ?? true;
          cell.textAlign = this.stypeOption?.footerAlignText ?? 'center';
          cell.verticalAlign =
            this.stypeOption?.footerVerticalAlignText ?? 'center';
          cell.fontSize = this.stypeOption?.footerFontSize ?? 15;
          cell.background = this.stypeOption?.footerBackground ?? '#e3e3e3';
          cell.color = this.stypeOption?.footerColor ?? 'black';
        });
      }
      // Thêm dòng nội dung tìm kiếm
      if (this.option?.Template.reportContent !== '') {
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
              value: this.option?.Template.reportContent,
              colSpan: numberColumns,
              rowSpan: 1,
              textAlign: 'center',
              verticalAlign: 'center',
              bold: false,
              fontSize: this.stypeOption?.fontSize ?? 14,
              wrap: true,
              background: this.stypeOption?.headerBackground ?? '#ffffff',
              fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
            },
          ],
        });
      }

      // Thêm dòng xe / nhóm xe
      if (this.option?.Template.ReportSubtitleLevel2 !== '') {
        rows.unshift({
          cells: [
            {
              value: this.option?.Template.ReportSubtitleLevel2,
              colSpan: numberColumns,
              rowSpan: 1,
              textAlign: 'center',
              verticalAlign: 'center',
              bold: false,
              fontSize: this.stypeOption?.fontSize ?? 14,
              wrap: true,
              fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
            },
          ],
        });
      }
      // Thêm dòng ngày tháng
      rows.unshift({
        cells: [
          {
            value: this.option?.Template.ReportSubtitleLevel1,
            colSpan: numberColumns,
            rowSpan: 1,
            textAlign: 'center',
            verticalAlign: 'center',
            bold: false,
            fontSize: this.stypeOption?.fontSize ?? 14,
            wrap: true,
            fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
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
            value: this.option?.Template.ReportTitle.toUpperCase(),
            colSpan: numberColumns,
            rowSpan: 2,
            textAlign: 'center',
            verticalAlign: 'center',
            bold: this.stypeOption?.titleBold ?? true,
            fontSize: this.stypeOption?.titlefontSize ?? 18,
            wrap: true,
            color: this.stypeOption?.titleColor ?? 'black',
            fontFamily: this.stypeOption?.fontFamily ?? 'Times New Roman',
          },
        ],
      });
      //#endregion  set title
      // create a Workbook and save the generated data URL
      // https://www.telerik.com/kendo-angular-ui/components/excelexport/api/Workbook/
      new Workbook(workbook).toDataURL().then((dataUrl: string) => {
        // https://www.telerik.com/kendo-angular-ui/components/filesaver/
        const reportName = this.option?.Template.FileName;
        saveAs(dataUrl, reportName + '.xlsx');
      });
    });
  }

  public exportExcelFromServer(): void {}

  /**
   * createCellHeader
   */
  public setStyleCellHeader(cell: WorkbookSheetRowCell): void {
    cell.bold = this.stypeOption?.headerBold ?? true;
    cell.textAlign = this.stypeOption?.headerAlignText ?? 'center';
    cell.verticalAlign = this.stypeOption?.headerVerticalAlignText ?? 'center';
    cell.fontSize = this.stypeOption?.headerFontSize ?? 17;
    cell.background = this.stypeOption?.headerBackground ?? '#ffffff';
    cell.color = this.stypeOption?.headerColor ?? '#000000';
    cell.fontFamily = this.stypeOption?.fontFamily ?? 'Times New Roman';
  }

  /**
   * setStyleCellSummary
   */
  public setStyleCellSummary(cell: WorkbookSheetRowCell): void {
    cell.bold = this.stypeOption?.footerBold ?? true;
    cell.textAlign = this.stypeOption?.footerAlignText ?? 'center';
    cell.verticalAlign = this.stypeOption?.footerVerticalAlignText ?? 'center';
    cell.fontSize = this.stypeOption?.footerFontSize ?? 15;
    cell.background = this.stypeOption?.footerBackground ?? '#e3e3e3';
    cell.color = this.stypeOption?.footerColor ?? 'black';
    cell.fontFamily = this.stypeOption?.fontFamily ?? 'Times New Roman';
  }

  /**
   * setStyleCellCommon
   */
  public setStyleCellCommon(cell: WorkbookSheetRowCell): void {
    cell.borderBottom = { color: '#666664', size: 1 };
    cell.borderLeft = { color: '#666664', size: 1 };
    cell.borderRight = { color: '#666664', size: 1 };
    cell.borderTop = { color: '#666664', size: 1 };
    cell.textAlign = 'center';
    cell.wrap = this.stypeOption?.wrap ?? true;
    cell.fontFamily = this.stypeOption?.fontFamily ?? 'Times New Roman';
    cell.fontSize = this.stypeOption?.fontSize ?? 14;
  }

  /**
   * createCell
   */
  public createCell(
    cellvalue: string,
    cellcolSpan: number,
    cellrowSpan: number,
    celltextAlign: string,
    cellverticalAlign: string,
    cellbold: boolean,
    cellfontSize: number,
    cellwrap: boolean,
    cellcolor: string,
    cellFontFamily: string
  ): any {
    return {
      value: cellvalue,
      colSpan: cellcolSpan,
      rowSpan: cellrowSpan,
      textAlign: celltextAlign,
      verticalAlign: cellverticalAlign,
      bold: cellbold,
      fontSize: cellfontSize,
      wrap: cellwrap,
      color: cellcolor,
      fontFamily: cellFontFamily,
    };
  }
}
