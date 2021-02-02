import {
  ColumnComponent,
  ExcelExportEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PDFExportEvent } from '@progress/kendo-angular-grid/dist/es2015/pdf/pdf-export-event';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseManager } from '../BLL/BaseManager/base-manager';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { ExportExcelOption, ExportOption } from '../Helper/export-option';
import { Pager } from './pager';
import { SummaryItems } from '../entities/summary-items';
import { ExportHelper } from '../Helper/export-helper';
import { CurrentData } from '../Page/tracking/tracking.component';
import { DateTime } from '../Helper/DateTimeHelper';
import { Directive, ViewChild } from '@angular/core';
import { FormReportBaseComponent } from '../Page/Report/BaseReport/form-report-base/form-report-base.component';
import { AuthorizeBase } from './authorize-base';
import { route } from '../app-routing.module';
import { PermissionKeyNames } from '../Enum/permission-key-names.enum';
import { MessageType } from '../Enum/message-type.enum';
import { ColumnsOptions } from './columns-option';
import {
  DateInputComponent,
  DatePickerComponent,
} from '@progress/kendo-angular-dateinputs';
@Directive()
export abstract class GeneralBaseReport<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> {
  constructor(
    private bManager: new () => TManager,
    protected cObj: new () => TEntity
  ) {
    // Sau khi các control khởi tạo xong
    setTimeout(() => {
      if (this.checkPermission()) {
        this.initPage();
        this.initPageData();
      }
    }, 100);
  }

  //#region PROPERTIES
  @ViewChild('grid') gridComponent: GridComponent;

  // Form base cho báo cáo
  @ViewChild(FormReportBaseComponent) form: FormReportBaseComponent;
  //
  @ViewChild('dtFromDate') dtFromDate: DatePickerComponent;
  @ViewChild('dtToDate') dtToDate: DatePickerComponent;

  public abstract authorized: AuthorizeBase = {
    canView: false,
    canExport: false,
    canOption: false,
    canAdd: false,
    canDelete: false,
    canUpdate: false,
  };

  // Đối tượng làm việc với API và xử lý logic
  public baseManager: TManager = new this.bManager();

  // dữ liệu truyền lên lưới
  public dataGrid: GridDataResult = { data: [], total: 0 };

  // danh sách tát cả dữ liệu (phục vụ cho xuất excel)
  public dataGridAll: ExcelExportData = { data: [] };

  /**
   * ĐỐi tượng đang được làm việc
   */
  public currentDataModel: TEntity = new this.cObj();

  // danh sách dữ liệu
  public dataSource: TEntity[];

  // Số dòng dữ liệu thực
  public rowCount: number;

  // Từ ngày
  public fromDate: Date = new Date(2007, 0, 1, 0, 0, 0);

  // Đến ngày
  public toDate: Date = new Date();

  // Ds xe được chọn
  public vehicleIDs = '';

  // Ds xe được chọn
  public vehiclePlates: string;

  // xoay trang khi xuất bc
  public isLandscape: boolean;

  // Tiêu đề báo cáo
  public abstract reportTitle: string;

  // Title trang
  abstract pageTitle = 'PAGE TITLE';

  // Titile của popup edit
  modalTitle = 'MODAL TITLE';

  // ngày tháng báo cáo
  public reportDate: string;
  // Xe / nhóm xe xuất bc
  public reportVehicle: string;

  // Thông tin khác
  public reportContent: string;

  // tên file báo cáo
  public reportName: string;

  // số ngày hỗ trợ tìm kiếm
  public daySupport = 30;

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

  // Header của lưới có định dạng gộp cột hay không?
  public isGroupColumnsHeader = false;

  //#endregion

  //#region METHODS

  /**
   * check quyền
   * Nếu không có quyền view thì sẽ redirect sang trang khác theo cấu hình
   */
  public checkPermission(): boolean {
    // Nếu là lưới master detail hoặc group header thì không cho ẩn hiện cột
    if (this.isMasterDetail || this.isGroupColumnsHeader) {
      this.authorized.canOption = false;
    }
    // Nếu không có quyền xem thì redirect sang trang access denied
    if (!this.authorized.canView) {
      route.navigate(['nopermission']);
      return false;
    }
    return true;
  }

  /**
   * Validate dữ liệu đầu vào để tìm kiếm
   */
  public validateData(): boolean {
    // Kiểm tra xem có control từ ngày đén ngày không?
    if (this.dtFromDate !== null || this.dtFromDate !== null) {
      // Nếu từ ngày lớn hơn đến ngày
      if (this.fromDate !== null && this.toDate !== null) {
        if (this.fromDate > this.toDate) {
          this.form.showMessageBoxOnPage(
            MessageType.warning,
            'Từ ngày không được lớn hơn đến ngày!'
          );
          return false;
        }
        const delta =
          Math.abs(this.toDate.getTime() - this.fromDate.getTime()) / 1000;
        // khoảng thời gian tìm kiếm lớn hơn số ngày cho phép tìm kiếm của báo cáo
        if (Math.floor(delta / 86400) > this.daySupport) {
          this.form.showMessageBoxOnPage(
            MessageType.warning,
            'Báo cáo chỉ hỗ trợ tìm kiếm dữ liệu trong ' +
              this.daySupport +
              ' ngày!'
          );
          return false;
        }
      } else if (this.fromDate === null) {
        // Nếu Từ ngày để trống
        this.form.showMessageBoxOnPage(
          MessageType.warning,
          'Từ ngày không được bỏ trống!'
        );
        this.dtFromDate.focus();
        return false;
      } else if (this.toDate === null) {
        // Nếu đến ngày để trống
        this.form.showMessageBoxOnPage(
          MessageType.warning,
          'Từ ngày không được bỏ trống!'
        );
        this.dtToDate.focus();
        return false;
      }
    }
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
    if (!this.isGroupColumnsHeader) {
      await this.getColumnsGridCustom();
      this.showHideColumnsGrid();
    }
  }

  /**
   * khỏi tạo dữ liệu cho các control trên trang
   */
  public initPageData(): void {
    const today = new Date();
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();
    if (this.dtFromDate !== null) {
      this.fromDate = new Date(year, month, day, 0, 0, 0);
    }
    if (this.dtToDate !== null) {
      this.toDate = new Date(year, month, day, 23, 59, 59);
    }
  }

  /**
   * Set dữ liệu tìm kiếm khi tìm kiếm
   */
  public setDataInput(pager: Pager): void {
    this.baseManager.baseFilter.companyID = CurrentData.CompanyID;
    this.baseManager.baseFilter.userID = CurrentData.UserID;
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
  ): Promise<{ data: TEntity[]; total: number }> {
    return await this.baseManager.getDataDetailOfMaster(item);
  }

  /**
   * Lấy dữ liệu để xuất bc
   */
  public allDataGrid = async (): Promise<ExcelExportData> => {
    this.isLoading = true;
    const pager = this.baseManager.pagerAll;
    this.setDataInput(pager);
    const lstData = await (await this.baseManager.getDataReport()).data;

    const result: ExcelExportData = {
      data: lstData,
    };
    this.dataGridAll = result;
    this.isLoading = false;
    return result;
  };

  // Lấy chi tiết của dòng cần xem
  public viewDetail = async (
    entity: TEntity
  ): Promise<{ data: TEntity[]; total: number }> =>
    await this.getDataDetailMaster(entity);

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
  public async getColumnsGridCustom(): Promise<void> {
    const fields = await this.baseManager.getColumnsGridCustom();
    this.baseManager.columnsGridCustom.forEach((clCus) => {
      if (fields !== '') {
        let isChecked = false;
        fields.split(',').forEach((feild) => {
          if (feild === clCus.field) {
            isChecked = true;
          }
        });
        clCus.visible = isChecked;
      }
    });
  }

  /**
   * Ẩn hiện cột theo cấu hình
   */
  public showHideColumnsGrid(): void {
    let index = 0;
    this.gridComponent.columns.forEach((column: ColumnComponent) => {
      if (this.authorized.canOption) {
        // Cột data
        if (column.field !== undefined) {
          // Ẩn cột khi visible = false và không bắt buộc hiển thị
          column.hidden =
            !this.baseManager.columnsGridCustom.filter(
              (x) => x.field === column.field
            )[0]?.visible &&
            this.baseManager.columnsGridRequired.filter(
              (x) => x.field === column.field
            ).length === 0;
        }
      } else {
        // Nếu người dùng không được phép ẩn hiện cột => CHo hiện hết lên
        column.hidden = false;
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
    this.isLoading = true;
    // Thiết lập header (title) cho báo cáo
    this.setHeaderReport();
    // Tên báo cáo
    this.reportName =
      this.convertUnicodeToStringNotAccented(this.reportTitle) +
      '_' +
      CurrentData.Username +
      '_' +
      new DateTime(new Date()).toFormat('dd_MM_yyyy_HH_mm_ss');

    if (this.isExportExcelInClient) {
      const option: ExportExcelOption = {
        Template: {
          ReportTitle: this.reportTitle,
          ReportSubtitleLevel1: this.reportDate,
          ReportSubtitleLevel2: this.reportVehicle,
          reportContent: this.reportContent,
          SheetName: this.convertUnicodeToStringNotAccented(this.reportTitle),
          FileName: this.reportName,
          reportList: this.dataGridAll,
          baseComponent: this,
          isSummary: this.baseManager.columnsSummary.length > 0,
          isGroupHeader: this.isGroupColumnsHeader,
          SettingColumns: [],
          Landscape: false,
        },
      };
      // Xuất excel từ client
      const exportHelper: ExportHelper = new ExportHelper(
        { footerBackground: '#ffffff' },
        option
      );
      // Báo cáo bình thường
      if (!this.isMasterDetail) {
        exportHelper.customExportExcel(e, grid);
      } else {
        // Báo cáo với master detail
        exportHelper.customExportExcelMasterDetail(e, grid);
      }
    } else {
      e.preventDefault();
      const allColumns: ColumnsOptions[] = [];
      this.gridComponent.columns.forEach((clmn: ColumnComponent) => {
        this.baseManager.columnsGridRequired.forEach((x) => {
          if (clmn.field === x.field) {
            allColumns.push(x);
          }
        });
        this.baseManager.columnsGridCustom.forEach((x) => {
          if (clmn.field === x.field) {
            allColumns.push(x);
          }
        });
      });

      const columns = allColumns
        .filter((x) => !x.isCommand)
        .map((x) => {
          return {
            ColumnName: x.field,
            Caption: x.title,
            Visible: x.visible === undefined ? true : x.visible,
            Format: x.format === undefined ? '' : x.format,
            Width: x.width === undefined ? 20 : x.width,
          };
        });

      const option: ExportExcelOption = {
        InputData: {},
        Template: {
          FileName: this.reportName,
          Landscape: false,
          ReportTitle: this.reportTitle,
          ReportSubtitleLevel1: this.reportDate,
          ReportSubtitleLevel2: this.reportContent,
          SheetName: this.convertUnicodeToStringNotAccented(this.reportTitle),
          SettingColumns: columns,
        },
      };
      this.baseManager.exportExcelFromServer(option);
    }
    this.isLoading = false;
  }

  /**
   * Xuất báo cáo dạng pdf
   */
  public exportPdf(e: PDFExportEvent, grid: GridComponent): void {
    grid.saveAsPDF();
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
    if (this.validateData()) {
      this.isLoading = true;
      const pager = new Pager(this.pageSize, this.pageIndex);
      // Set dữ liệu đầu vào tìm kiếm
      this.setDataInput(pager);
      // Lấy dữ liệu
      this.dataGrid = await this.getData();
      // Nếu có cột cần tính tổng thì láy tổng theo cột đó
      if (this.baseManager.columnsSummary.length > 0) {
        this.columnsSummaryItems = await this.getSummaryItems();
      }

      this.isLoading = false;
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
  public async onSaveCustomColumns_Click(isSave: boolean): Promise<void> {
    if (isSave) {
      await this.baseManager.saveCustomColumns();
      await this.getColumnsGridCustom();
      this.showHideColumnsGrid();
    } else {
      await this.getColumnsGridCustom();
      this.showHideColumnsGrid();
    }
  }

  public onRowComand_Click(event: { action: string; dataItem: TEntity }): void {
    switch (event.action) {
      case 'edit':
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Sửa thông tin lái xe';
        this.form.edit();
        break;
      case 'remove':
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Xóa thông tin lái xe';
        this.form.edit();
        break;
    }
  }

  //#endregion
}
