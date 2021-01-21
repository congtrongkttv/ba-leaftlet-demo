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
import { CurrentData } from '../Page/tracking/tracking.component';
import { DateTime } from '../Helper/DateTimeHelper';
import { BaseService } from '../Services/Base/base.service';
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

  // Đối tượng làm việc với API và xử lý logic
  public baseManager: TManager = new this.bManager();

  // dữ liệu truyền lên lưới
  public dataGrid: GridDataResult = { data: [], total: 0 };

  // danh sách dữ liệu
  public dataSource: TEntity[];

  // Số dòng dữ liệu thực
  public rowCount: number;

  // Từ ngày
  public fromDate: Date = new Date();

  // Đến ngày
  public toDate: Date = new Date();

  // Ds xe được chọn
  public vehicleIDs = '';

  // Ds xe được chọn
  public vehiclePlates: string;

  // xoay trang khi xuất bc
  public isLandscape: boolean;

  // Tiêu đề báo cáo
  public reportTitle: string;

  // ngày tháng báo cáo
  public reportDate: string;
  // Xe / nhóm xe xuất bc
  public reportVehicle: string;

  // Thông tin khác
  public reportContent: string;

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

  // Số nút hiển thị ở pagging
  public buttonCount = 5;

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
   * Nếu không có quyền view thì sẽ redirect sang trang khác theo cấu hình
   */
  public checkPermission(): void {}

  /**
   * Validate dữ liệu đầu vào để tìm kiếm
   */
  public validateData(): boolean {
    return true;
  }

  public hasPermission(permissionKey: number): boolean {
    return CurrentData.permissions.indexOf(permissionKey) >= 0;
  }

  /**
   * khỏi tạo trang
   */
  public initPage(): void {
    this.getColumnsGridCustom();
  }

  /**
   * khỏi tạo dữ liệu cho các control trên trang
   */
  public initPageData(): void {}

  /**
   * Set dữ liệu tìm kiếm khi tìm kiếm
   */
  public setDataInput(pager: Pager): void {
    this.baseManager.baseFilter.companyID = CurrentData.CompanyID;
    this.baseManager.baseFilter.fromDate = this.fromDate;
    this.baseManager.baseFilter.toDate = this.toDate;
    this.baseManager.baseFilter.vehicleIDs = this.vehicleIDs;
    this.baseManager.baseFilter.currentPager = pager;
  }

  /**
   * Lấy dữ liệu
   */
  public async getData(): Promise<{ data: TEntity[]; total: 0 }> {
    return await this.baseManager.getDataReport();
  }

  /**
   * Lấy dữ liệu để xuất bc
   */
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

  public setHeaderReport(): void {
    this.reportDate =
      '00:00 ' +
      new DateTime(this.fromDate).toFormat('dd/MM/yyyy') +
      ' - ' +
      new DateTime(this.toDate).toFormat('HH:mm dd/MM/yyyy');
    this.reportVehicle =
      this.vehicleIDs === '' ? 'BKS: Tất cả' : 'BKS: ' + this.vehiclePlates;
  }

  /**
   * Xuất báo cáo dạng excel
   */
  public exportExcel(e: ExcelExportEvent, grid: GridComponent): void {
    if (this.isExportExcelInClient) {
      // Xuất excel từ client
      this.setHeaderReport();
      const exportHelper: ExportHelper = new ExportHelper(
        this.reportTitle,
        this.reportDate,
        this.reportVehicle,
        this.reportContent
      );
      exportHelper.customExportExcel(e, grid);
    } else {
      // Xuất excel từ server
      const exportHelper: ExportHelper = new ExportHelper(
        this.reportTitle,
        this.reportDate,
        this.reportVehicle,
        this.reportContent
      );
      exportHelper.exportExcelFromServer();
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
      this.setDataInput(pager);
      this.dataGrid = await this.getData();
      // this.rowCount = await this.getRowCount();
      // this.dataGrid = { data: this.dataSource, total: this.rowCount };
      if (this.baseManager.columnsSummaryItems.length > 0) {
        this.columnsSummaryItemsResponse = await this.getSummaryItems();
      }
      this.isLoading = false;
    }
  }

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

  /**
   * Sự kiện lưu cấu hình ẩn hiện cột
   */
  onSaveCustomColumns_Click(): void {
    this.baseManager.saveCustomColumns();
  }

  /**
   * Kiểm tra xem cột có được ẩn hiện không?
   * @param feild Tên trường cần kiểm tra
   */
  checkIsShowColumn(feild: string): boolean {
    return this.baseManager.columnsGridCustom.filter(
      (x) => x.feild === feild
    )[0]?.checked;
  }
  //#endregion
}
