import {
  ColumnBase,
  ColumnComponent,
  CommandColumnComponent,
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
import {
  ExcelExportData,
  Workbook,
} from '@progress/kendo-angular-excel-export';
import { PDFExportEvent } from '@progress/kendo-angular-grid/dist/es2015/pdf/pdf-export-event';
import { ExportHelper } from '../Helper/export-helper';
import { CurrentData } from '../Page/tracking/tracking.component';
import { DateTime } from '../Helper/DateTimeHelper';
import { Directive, ViewChild } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { saveAs } from '@progress/kendo-file-saver';
@Directive()
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

    // Sau khi các control khởi tạo xong
    setTimeout(() => {
      this.initPage();
      this.initPageData();
    }, 100);
  }

  //#region PROPERTIES
  @ViewChild('grid') gridComponent: GridComponent;

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

  // danh sách tát cả dữ liệu (phục vụ cho xuất excel)
  public dataGridAll: any;

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
  public columnsSummaryItems: SummaryItems = new SummaryItems();

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

  // Có phải dạng master detail kjhoong?
  public isMasterDetail = false;

  // Lấy chi tiết của dòng cần xem
  public viewDetail = async (
    entity: TEntity
  ): Promise<{ data: TEntity[]; total: 0 }> =>
    await this.getDataDetailMaster(entity);
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
    const a = CurrentData.permissions.indexOf(permissionKey) >= 0;
    return a;
  }

  /**
   * khỏi tạo trang
   */
  public async initPage(): Promise<void> {
    await this.getColumnsGridCustom();
    this.showHideColumnsGrid();
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
   * Lấy dữ liệu chi tiết
   */
  public async getDataDetailMaster(
    item: TEntity
  ): Promise<{ data: TEntity[]; total: 0 }> {
    return await this.baseManager.getDataReportDetail(item);
  }
  /**
   * Lấy dữ liệu để xuất bc
   */
  public allDataGrid = async (): Promise<ExcelExportData> => {
    this.isLoading = true;
    const lstData = await (await this.baseManager.getAllDataReport()).data;

    const result: ExcelExportData = {
      data: lstData,
    };
    this.dataGridAll = result;
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
      field: string;
      checked: boolean;
    }[] = this.baseManager.getColumnsGridCustom();
    this.baseManager.columnsGridCustom.forEach((clCus) => {
      columns.forEach((cl) => {
        if (cl.field === clCus.field) {
          clCus.checked = cl.checked;
        }
      });
    });
  }

  /**
   * Ẩn hiện cột theo cấu hình
   */
  public showHideColumnsGrid(): void {
    let index = 0;
    this.gridComponent.columns.forEach((column: ColumnComponent) => {
      // Cột data
      if (column.field !== undefined) {
        column.hidden =
          !this.baseManager.columnsGridCustom.filter(
            (x) => x.field === column.field
          )[0]?.checked &&
          this.baseManager.columnsGridRequired.filter(
            (x) => x.field === column.field
          ).length === 0;
      } else {
        // Cột command
        const a: any = !this.baseManager.columnsGridCustom.filter(
          (x: {
            title: string;
            field: string;
            checked: boolean;
            columnIndex?: number;
          }) => x.columnIndex === index
        )[0]?.checked;
        column.hidden = a;
      }
      index++;
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
        this.reportContent,
        this.convertUnicodeToStringNotAccented(this.reportTitle),
        this.dataGridAll,
        this,
        {
          isSummary: this.baseManager.columnsSummary.length > 0,
          isMasterDetailGrid: this.isMasterDetail,
        }
      );
      // Báo cáo bình thường
      if (!this.isMasterDetail) {
        exportHelper.customExportExcel(e, grid);
      } else {
        // Báo cáo với master detail
        exportHelper.customExportExcelMasterDetail(e, grid);
      }
    } else {
      // Xuất excel từ server
      const exportHelper: ExportHelper = new ExportHelper(
        this.reportTitle,
        this.reportDate,
        this.reportVehicle,
        this.reportContent,
        this.convertUnicodeToStringNotAccented(this.reportTitle),
        this.dataGridAll,
        {
          isSummary: this.baseManager.columnsSummary.length > 0,
        }
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
      if (this.baseManager.columnsSummary.length > 0) {
        this.columnsSummaryItems = await this.getSummaryItems();
      }
      this.reportName =
        this.convertUnicodeToStringNotAccented(this.reportTitle) +
        '_' +
        CurrentData.Username +
        '_' +
        new DateTime(new Date()).toFormat('dd_MM_yyyy_HH_mm_ss');
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
  public onSaveCustomColumns_Click(isSave: boolean): void {
    if (isSave) {
      this.baseManager.saveCustomColumns();
      this.showHideColumnsGrid();
    } else {
      this.getColumnsGridCustom();
      this.showHideColumnsGrid();
    }
  }

  public convertUnicodeToStringNotAccented(text: string): string {
    let outPut = text;
    if (text !== undefined) {
      outPut = outPut.toLowerCase();
      outPut = outPut.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      outPut = outPut.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      outPut = outPut.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      outPut = outPut.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      outPut = outPut.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      outPut = outPut.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      outPut = outPut.replace(/đ/g, 'd');
      outPut = outPut.replace(/^\-+|\-+$/g, '');
      outPut = outPut.replace(/ /g, '_');
    }
    return outPut;
  }
  //#endregion
}
