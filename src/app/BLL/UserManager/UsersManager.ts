import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
import { SummaryItems } from '../../entities/summary-items';
import { CurrentData } from 'src/app/Page/tracking/tracking.component';
import { Pager } from 'src/app/Core/pager';
import { UserEntity } from '../../entities/Users/User';
import { UserFilter } from '../../entities/Users/UserFilter';
import { UserService } from '../../Services/user/user.service';
export class UsersManager extends BaseManager<UserEntity, UserFilter> {
  constructor() {
    super(DriverFilter);
    this.baseService = AppInjector.get(UserService);
  }
  baseService: UserService;

  // Ds các cột của master
  columnDetail = [
    { title: 'STT', field: 'rowNumber', width: 50 },
    { title: 'Tên đăng nhập', field: 'Username' },
    { title: 'Tên đầy đủ', field: 'Fullname' },
    { title: 'Số điện thoại', field: 'PhoneNumber' },
  ];

  // Ds các cột cần tính tổng
  columnsGridRequired = [{ title: 'STT', field: 'rowNumber', checked: false }];

  /**
   * Danh sách cột có thể ẩn hiện của lưới
   */
  columnsGridCustom = [
    { title: 'Công ty', field: 'FK_CompanyID', checked: true },
    { title: 'Tên đăng nhập', field: 'Username', checked: true },
    { title: 'Tên hiển thị', field: 'Fullname', checked: true },
    { title: 'SĐT', field: 'PhoneNumber', checked: true },
    { title: 'Email', field: 'Email', checked: true },
  ];

  async getDataReport(): Promise<{ data: UserEntity[]; total: 0 }> {
    // Lấy dữ liệu
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        return { data: x.Data.Data, total: x.Data.Count };
      })
      .catch((ex) => {
        return { data: [], total: 0 };
      });
  }

  public async getDataReportDetail(
    item: UserEntity
  ): Promise<{ data: UserEntity[]; total: 0 }> {
    // Lấy dữ liệu
    this.baseFilter.currentPager = this.pagerAll;
    this.baseFilter.companyID = item.FK_CompanyID;
    return await this.baseService
      .getDataByCompanyID(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const dataDriver = x.Data.Data;
        let index = 0;
        dataDriver.forEach((d: UserEntity) => {
          index++;
          d.rowNumber = index;
        });
        return { data: x.Data.Data, total: x.Data.Count };
      })
      .catch(() => {
        return null;
      });
  }

  async getAllDataReport(): Promise<{ data: UserEntity[]; total: 0 }> {
    // Lấy dữ liệu
    this.baseFilter.currentPager = this.pagerAll;
    return await this.baseService
      .getData(this.baseFilter)
      .toPromise()
      .then((x: any) => {
        const dataDriver = x.Data.Data;
        let index = 0;
        dataDriver.forEach((d: UserEntity) => {
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
      'user_custom_columns_' + CurrentData.UserID.toString(),
      JSON.stringify(this.columnsGridCustom)
    );
  }

  getColumnsGridCustom(): {
    title: string;
    field: string;
    checked: boolean;
  }[] {
    const customColumnsStr = localStorage.getItem(
      'user_custom_columns_' + CurrentData.UserID.toString()
    );
    if (customColumnsStr != null) {
      return JSON.parse(customColumnsStr);
    } else {
      return [];
    }
  }

  async addNew(entity: UserEntity): Promise<boolean> {
    return this.baseService
      .add(entity)
      .toPromise()
      .then((x: any) => {
        return true;
      });
  }

  async update(entity: UserEntity): Promise<boolean> {
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
