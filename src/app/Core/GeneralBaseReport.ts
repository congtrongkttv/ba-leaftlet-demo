import {
  ColumnComponent,
  ExcelExportEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseFilter } from '../entities/Base/BaseFilter';

import { Pager } from './pager';
import { SummaryItems } from '../entities/summary-items';
import { Observable } from 'rxjs';
import {
  ExcelExportData,
  Workbook,
  WorkbookSheet,
} from '@progress/kendo-angular-excel-export';
import { PDFExportEvent } from '@progress/kendo-angular-grid/dist/es2015/pdf/pdf-export-event';
import { ExportHelper } from '../Helper/export-helper';
export class GeneralBaseReport<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> {
  constructor(
    private bManager: new () => TManager,
    protected cObj: new () => TEntity
  ) {
    this.checkPermission();
    this.initPage();
  }
  //#region PROPERTIES
  // Quyền xe
  public permissionKeyNameView: number;
  // Quyền xuất bc
  public permissionKeyNameExport: number;
  // Quyềm ẩn hiện cột
  public permissionKeyNameOption: number;

  public baseManager: TManager = new this.bManager();
  // dữ liệu truyền lên lưới
  public dataGrid: GridDataResult = { data: [], total: 0 };
  // danh sách dữ liệu
  public dataSource: TEntity[];
  // Số dòng dữ liệu thực
  public rowCount: number;
  // xoay trang khi xuất bc
  public isLandscape: boolean;
  // Tiêu đề báo cáo
  public reportTitle: string;
  // ngày tháng báo cáo
  public reportDate = '';
  // Xe / nhóm xe xuất bc
  public reportVehicle: string;
  // tên file báo cáo
  public reportName: string;
  // số ngày hỗ trợ tìm kiếm
  public daySupport: number;
  // ds cột của lưới dữ liệu
  public columnsGrid: any[];

  // ds cột cần tính tổng
  public columnsSummaryItemsResponse: SummaryItems = new SummaryItems();

  // Grid properties
  public pageSize = 10;
  // trang đang focus
  public pageIndex = 0;
  // nếu đang tìm kiếm thì hiển thị progess bar của grid
  public isLoading = false;
  // số dòng bảo qua khi thay đổi pageIndex
  public skip = 0;
  // Xuất ecxel tại client hay server
  public isExportExcelInClient = true;

  //#endregion

  //#region METHODS
  /**
   * check quyền
   */
  public checkPermission(): void {}
  /**
   * Validate dữ liệu đầu vào tìm kiếm
   */
  public validateData(): boolean {
    return true;
  }
  /**
   * khỏi tạo trang
   */
  public initPage(): void {
    this.getColumnsGridCustom();
  }
  /**
   * Set dữ liệu tìm kiếm khi tìm kiếm
   */
  public setDataInput(pager: Pager): void {
    // const pager = new Pager(this.pageSize, this.pageIndex);
    this.baseManager.currentPager = pager;
  }

  /**
   * Lấy dữ liệu
   */
  public async getData(pager: Pager): Promise<{ data: TEntity[]; total: 0 }> {
    this.setDataInput(pager);
    return await this.baseManager.getDataReport();
  }

  public allDataGrid = async (): Promise<ExcelExportData> => {
    this.isLoading = true;
    const listDriver = await (await this.baseManager.getAllDataReport()).data;

    const result: ExcelExportData = {
      data: listDriver,
    };
    this.isLoading = false;
    return result;
  };
  /**
   * Lấy số dòng của tất cả dữ liệu theo đầu vào tìm kiếm
   */
  public async getRowCount(): Promise<number> {
    return await this.baseManager.getRowCountReport();
  }
  /**
   * Lấy số dòng của tất cả dữ liệu theo đầu vào tìm kiếm
   */
  public async getSummaryItems(): Promise<SummaryItems> {
    return await this.baseManager.getSummaryReport();
  }
  /**
   * Lấy ds các cột custom
   */
  public getColumnsGridCustom(): void {
    const columns: {
      title: string;
      feild: string;
      checked: boolean;
    }[] = this.baseManager.getColumnsGridCustom();
    this.baseManager.columnsGridCustom.forEach((clCus) => {
      columns.forEach((cl) => {
        if (cl.feild === clCus.feild) {
          clCus.checked = cl.checked;
        }
      });
    });
  }
  /**
   * Xuất báo cáo dạng excel
   */
  public exportExcel(e: ExcelExportEvent, grid: GridComponent): void {
    if (this.isExportExcelInClient) {
      // Xuất excel từ client
      const exportHelper: ExportHelper = new ExportHelper(
        this.reportTitle,
        this.reportDate,
        this.reportVehicle
      );
      exportHelper.customExportExcel(e, grid);
    } else {
      // Xuất excel từ server
    }
  }

  /**
   * Xuất báo cáo dạng pdf
   */
  public exportPdf(e: PDFExportEvent, grid: GridComponent): void {
    // this.customExportExcel(e, grid);
    console.log(e);
  }

  /**
   * Khi tìm kiếm thì cho skip và page index về mặc định ban đầu
   */
  public resetGrid(): void {
    this.pageIndex = 0;
    this.skip = 0;
  }
  /**
   * Lấy dữ liệu và bind to grid
   */
  public async bindData(): Promise<void> {
    if (this.validateData) {
      this.isLoading = true;
      const pager = new Pager(this.pageSize, this.pageIndex);
      this.dataGrid = await this.getData(pager);
      // this.rowCount = await this.getRowCount();
      // this.dataGrid = { data: this.dataSource, total: this.rowCount };
      if (this.baseManager.columnsSummaryItemsRequest.length > 0) {
        this.columnsSummaryItemsResponse = await this.getSummaryItems();
      }
      this.isLoading = false;
    }
  }

  // public dataAllGrid = (): Promise<any> => {
  //   const pager = new Pager(this.pageSize, this.pageIndex);
  //   const data = await this.getData(pager);
  //   const total = data.length;
  //   this.dataGrid = { data: this.dataSource, total: this.rowCount };
  // };

  //#endregion

  //#region EVENTS
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageIndex = event.skip / this.pageSize;
    this.bindData();
  }
  /**
   * sw kiện tìm kiếm dữ liệu
   */
  public onSearch_Click(): void {
    this.resetGrid();
    this.bindData();
  }
  onSaveCustomColumns_Click(): void {
    this.baseManager.saveCustomColumns();
  }

  checkIsShowColumn(feild: string): boolean {
    return this.baseManager.columnsGridCustom.filter(
      (x) => x.feild === feild
    )[0]?.checked;
  }
  //#endregion
}
