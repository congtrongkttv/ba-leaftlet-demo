import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
import { SummaryItems } from '../../entities/summary-items';
import { CurrentData } from 'src/app/Page/tracking/tracking.component';
export class DriversManager extends BaseManager<DriverEntity, DriverFilter> {
  constructor() {
    super(DriverFilter);
    this.baseService = AppInjector.get(DriverService);
  }
  baseService: DriverService;
  // Ds các cột cần tính tổng
  columnsSummaryItemsRequest = ['FK_CompanyID', 'FK_DepartmentID', 'Flags'];

  columnsGridCustom = [
    { title: 'Công ty', feild: 'FK_CompanyID', checked: false },
    { title: 'Phòng ban', feild: 'FK_DepartmentID', checked: false },
    { title: 'Mã NV', feild: 'EmployeeCode', checked: false },
    { title: 'Tên hiển thị', feild: 'DisplayName', checked: false },
    { title: 'Tên đăng nhập', feild: 'Name', checked: false },
    { title: 'Flags', feild: 'Flags', checked: false },
    { title: 'Command', feild: 'command', checked: false },
  ];

  async getDataReport(): Promise<{ data: DriverEntity[]; total: 0 }> {
    // Các trường cần tìm kiếm
    this.baseFilter.pager = this.currentPager;
    this.baseFilter.searchContent = this.searchContent;
    // Lấy dữ liệu
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        return { data: x.Data.Data, total: x.Data.Count };
      })
      .catch(() => {
        return null;
      });
  }

  async getAllDataReport(): Promise<{ data: DriverEntity[]; total: 0 }> {
    // Các trường cần tìm kiếm
    this.baseFilter.pager = this.pagerAll;
    this.baseFilter.searchContent = this.searchContent;
    // Lấy dữ liệu
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        return { data: x.Data.Data, total: x.Data.Count };
      })
      .catch(() => {
        return null;
      });
  }

  async getRowCountReport(): Promise<number> {
    // Các trường cần tìm kiếm
    this.baseFilter.searchContent = this.searchContent;
    // Lấy dữ liệu
    return await this.baseService
      .getRowCount(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        return x.Data;
      })
      .catch(() => {
        return 0;
      });
  }

  async getSummaryReport(): Promise<SummaryItems> {
    // Các trường cần tìm kiếm
    this.baseFilter.searchContent = this.searchContent;
    this.baseFilter.feildSum = this.columnsSummaryItemsRequest.join(',');
    // Lấy dữ liệu
    const summaryItems = new SummaryItems();
    return await this.baseService
      .getSummaries(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const data: DriverEntity = x.Data;
        summaryItems.column1 = data.FK_CompanyID;
        summaryItems.column2 = data.FK_DepartmentID;
        summaryItems.column6 = data.Flags;
        return summaryItems;
      })
      .catch(() => {
        return summaryItems;
      });
  }

  saveCustomColumns(): void {
    localStorage.setItem(
      'driver_custom_columns_' + CurrentData.UserID.toString(),
      JSON.stringify(this.columnsGridCustom)
    );
  }

  getColumnsGridCustom(): {
    title: string;
    feild: string;
    checked: boolean;
  }[] {
    const customColumnsStr = localStorage.getItem(
      'driver_custom_columns_' + CurrentData.UserID.toString()
    );
    if (customColumnsStr != null) {
      return JSON.parse(customColumnsStr);
    } else {
      return [];
    }
  }

  async addNewDriver(entity: DriverEntity): Promise<boolean> {
    return this.baseService
      .add(entity)
      .toPromise()
      .then((x) => {
        return true;
      });
  }

  async updateDriver(entity: DriverEntity): Promise<boolean> {
    return this.baseService
      .update(entity)
      .toPromise()
      .then((x) => {
        return true;
      });
  }

  async deleteDriver(id: any): Promise<boolean> {
    return this.baseService
      .delete(id)
      .toPromise()
      .then((x) => {
        return true;
      });
  }
}
