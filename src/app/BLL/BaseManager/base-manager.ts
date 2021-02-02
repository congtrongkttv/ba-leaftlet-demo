import { Pager } from '../../Core/pager';
import { BaseService } from '../../Services/Base/base.service';
import { BaseFilter } from '../../entities/Base/BaseFilter';
import { AppInjector } from '../../app.module';
import { SummaryItems } from '../../entities/summary-items';
import { CurrentData } from '../../Page/tracking/tracking.component';
import { HttpClient } from '@angular/common/http';
import { ExportExcelOption } from 'src/app/Helper/export-option';
import { ColumnsOptions } from '../../Core/columns-option';

/**
 * Trang quản lý để xử lý logic, truy xuất dữ liệu
 * @template TEntity ĐỐi tượng trả về
 */
export abstract class BaseManager<TEntity, TFilter extends BaseFilter> {
  constructor(protected bFilter: new () => TFilter) {}

  public httpClient: HttpClient = AppInjector.get(HttpClient);
  // Thông tin pagerAll: Sử dụng khi get Rowcount, lấy tất cả dữ liệu
  public pagerAll: Pager = new Pager(387590 * 1000, 0);

  // BaseService
  public baseService = AppInjector.get(BaseService);

  // baseFilter: bộ lọc dữ liệu - điều kiện tìm kiếm
  public baseFilter: TFilter = new this.bFilter();

  public reportType: number;

  // ds cột cần tính tổng
  public columnsSummary: string[] = [];

  // ds cột của master-detail
  public columnDetail: ColumnsOptions[] = [];

  // ds cột bắt buộc của lưới dữ liệu
  public columnsGridRequired: ColumnsOptions[] = [];

  // ds cột cho phép ẩn hiện của lưới dữ liệu
  public columnsGridCustom: ColumnsOptions[] = [];

  // ds cột không cho phép hiện lên khi xuất báo cáo
  public columnsGridExclude: any[];

  /**
   * Lấy dữ liệu
   */
  public async getDataReport(): Promise<{ data: TEntity[]; total: 0 }> {
    return null;
  }

  /**
   * Lấy dữ liệu
   */
  public async getDataDetailOfMaster(
    item: TEntity
  ): Promise<{ data: TEntity[]; total: number }> {
    return null;
  }

  /**
   * Lấy số dòng dữ liệu để phân trang custom
   */
  public async getRowCountReport(): Promise<number> {
    return null;
  }

  /**
   * Lấy số dòng dữ liệu để phân trang custom
   */
  public async getSummaryReport(): Promise<SummaryItems> {
    return null;
  }

  public async addNew(entity: TEntity): Promise<boolean> {
    return null;
  }

  public async update(entity: TEntity): Promise<boolean> {
    return null;
  }

  public async delete(id: any): Promise<boolean> {
    return null;
  }

  /**
   * Lấy ra cấu hình ẩn hiện cột
   */
  public getColumnsGridCustom(): Promise<string> {
    const userID = CurrentData.UserID;
    const fields = this.columnsGridCustom
      .map((x: ColumnsOptions) => {
        return x.field;
      })
      .join(',');

    const data = {
      FK_UserID: userID,
      ReportTypeID: this.reportType,
    };
    return this.baseService
      .getColumnsGridCustom(data)
      .toPromise()
      .then((x: any) => {
        if (x.Data != null) {
          return x.Data?.SelectedReportColumns;
        } else {
          return '';
        }
      });
  }

  /**
   * Lưu cấu hình ẩn hiện cột
   */
  public saveCustomColumns(): Promise<void> {
    const userID = CurrentData.UserID;
    const fields = this.columnsGridCustom
      .map((x: ColumnsOptions) => {
        if (x.visible) {
          return x.field;
        }
      })
      .join(',');

    const data = {
      FK_UserID: userID,
      ReportTypeID: this.reportType,
      SelectedReportColumns: fields,
    };

    return this.baseService
      .saveCustomColumn(data)
      .toPromise()
      .then((x) => {
        return null;
      });
  }

  /**
   * Lưu cấu hình ẩn hiện cột
   */
  public exportExcelFromServer(option: ExportExcelOption): Promise<void> {
    return null;
  }
}
