import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
import { SummaryItems } from '../../entities/summary-items';
import { CurrentData } from 'src/app/Page/tracking/tracking.component';
import { Pager } from 'src/app/Core/pager';
export class DriversManager extends BaseManager<DriverEntity, DriverFilter> {
  constructor() {
    super(DriverFilter);
    this.baseService = AppInjector.get(DriverService);
  }
  baseService: DriverService;
  // Ds các cột cần tính tổng
  columnsSummary = ['FK_CompanyID', 'FK_DepartmentID', 'Flags'];

  columnsGridRequired = [{ title: 'STT', field: 'rowNumber', checked: false }];

  /**
   * Danh sách cột có thể ẩn hiện của lưới
   */
  columnsGridCustom = [
    { title: 'Công ty', field: 'FK_CompanyID', checked: true },
    { title: 'Phòng ban', field: 'FK_DepartmentID', checked: true },
    { title: 'Mã NV', field: 'EmployeeCode', checked: true },
    { title: 'Tên hiển thị', field: 'DisplayName', checked: true },
    { title: 'Tên đăng nhập', field: 'Name', checked: true },
    { title: 'Flags', field: 'Flags', checked: true },
    { title: 'Sửa', field: 'commandUpdate', columnIndex: 7, checked: true },
    { title: 'Xóa', field: 'commandDelete', columnIndex: 8, checked: true },
  ];

  async getDataReport(): Promise<{ data: DriverEntity[]; total: 0 }> {
    // Lấy dữ liệu
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const dataDriver = x.Data.Data;

        return { data: dataDriver, total: x.Data.Count };
      })
      .catch((ex) => {
        return { data: [], total: 0 };
      });
  }

  async getAllDataReport(): Promise<{ data: DriverEntity[]; total: 0 }> {
    // Lấy dữ liệu
    this.baseFilter.currentPager = this.pagerAll;
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const dataDriver = x.Data.Data;
        let index = 0;
        dataDriver.forEach((d: DriverEntity) => {
          index++;
          d.rowNumber = index;
        });
        return { data: x.Data.Data, total: x.Data.Count };
      })
      .catch(() => {
        return null;
      });
  }

  async getRowCountReport(): Promise<number> {
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
    // Lấy dữ liệu
    const summaryItems = new SummaryItems();
    return await this.baseService
      .getSummaries(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const data: DriverEntity = x.Data;
        summaryItems.column1 = data.FK_CompanyID;
        summaryItems.column4 = data.FK_DepartmentID;
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
    field: string;
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

  async addNew(entity: DriverEntity): Promise<boolean> {
    return this.baseService
      .add(entity)
      .toPromise()
      .then((x: any) => {
        return true;
      });
  }

  async update(entity: DriverEntity): Promise<boolean> {
    return this.baseService
      .update(entity)
      .toPromise()
      .then((x) => {
        return true;
      });
  }

  async delete(id: any): Promise<boolean> {
    return this.baseService
      .delete(id)
      .toPromise()
      .then((x) => {
        return true;
      });
  }
}
