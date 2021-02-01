import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
import { SummaryItems } from '../../entities/summary-items';
import { CurrentData } from 'src/app/Page/tracking/tracking.component';
import { Pager } from 'src/app/Core/pager';
import { ReportType } from '../../Enum/report-type.enum';
import { HttpClient } from '@angular/common/http';
import { title } from 'process';
export class DriversManager extends BaseManager<DriverEntity, DriverFilter> {
  constructor() {
    super(DriverFilter);
    this.baseService = AppInjector.get(DriverService);
  }
  baseService: DriverService;
  reportType = ReportType.reportDrivers;
  // Ds các cột cần tính tổng
  columnsSummary = ['FK_CompanyID', 'FK_DepartmentID', 'Flags'];

  columnsGridRequired = [
    { title: 'STT', field: 'rowNumber', checked: false },
    { title: 'Công ty', field: 'FK_CompanyID', checked: false },
  ];

  /**
   * Danh sách cột có thể ẩn hiện của lưới
   */
  columnsGridCustom = [
    { title: 'Phòng ban', field: 'FK_DepartmentID', checked: true },
    { title: 'Mã NV', field: 'EmployeeCode', checked: true },
    { title: 'Tên hiển thị', field: 'DisplayName', checked: true },
    { title: 'Tên đăng nhập', field: 'Name', checked: true },
    { title: 'Ngày sinh nhật', field: 'Birthday', checked: true },
    { title: 'Flags', field: 'Flags', checked: false },
    { title: 'Sửa', field: 'updateCommand', checked: false },
    { title: 'Xóa', field: 'deleteCommand', checked: false },
  ];

  columnsGridAll: {
    title: string;
    field: string;
    visible: boolean;
    width?: number;
    format?: string;
    isSummary?: boolean;
    isCommand?: boolean;
    command?: string;
    clumnSumIndex?: number;
    clsCommand?: string;
  }[] = [
    {
      title: 'STT',
      field: 'rowNumber',
      visible: true,
      width: 50,
    },
    {
      title: 'Công ty',
      field: 'FK_CompanyID',
      visible: true,
      width: 100,
      clumnSumIndex: 1,
      isSummary: true,
    },
    {
      title: 'Phòng ban',
      field: 'FK_DepartmentID',
      visible: true,
      width: 100,
      isSummary: true,
      clumnSumIndex: 2,
    },
    {
      title: 'Mã NV',
      field: 'EmployeeCode',
      visible: true,
      width: 100,
    },
    {
      title: 'Tên hiển thị',
      field: 'DisplayName',
      visible: true,
      width: 100,
    },
    {
      title: 'Tên đăng nhập',
      field: 'Name',
      visible: true,
      width: 100,
    },
    {
      title: 'Ngày sinh nhật',
      field: 'Birthday',
      visible: true,
      width: 100,
      format: 'dd/MM/yyyyy',
    },
    {
      title: 'Flags',
      field: 'Flags',
      visible: true,
      width: 100,
      clumnSumIndex: 7,
      isSummary: true,
    },
    {
      title: 'Sửa',
      field: 'updateCommand',
      visible: true,
      width: 50,
      isCommand: true,
      command: 'edit',
      clsCommand: 'fa fa-edit',
    },
    {
      title: 'Xóa',
      field: 'deleteCommand',
      visible: true,
      width: 50,
      isCommand: true,
      command: 'remove',
      clsCommand: 'fa fa-remove',
    },
  ];

  async getDataReport(): Promise<{ data: DriverEntity[]; total: 0 }> {
    // Lấy dữ liệu
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
      .catch((ex) => {
        return { data: [], total: 0 };
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
        summaryItems[1] = data.FK_CompanyID;
        summaryItems[2] = data.FK_DepartmentID;
        summaryItems[7] = data.Flags;
        return summaryItems;
      })
      .catch(() => {
        return summaryItems;
      });
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
