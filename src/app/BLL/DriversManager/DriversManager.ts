import { BaseManager } from '../BaseManager/base-manager';
import { DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { SummaryItems } from '../../entities/summary-items';
import { ReportType } from '../../Enum/report-type.enum';
import * as FileSaver from 'file-saver';
import { ColumnsOptions } from '../../Core/columns-option';
import { ExportExcelOption } from '../../Helper/export-option';
import { AnyARecord } from 'dns';
export class DriversManager extends BaseManager<DriverEntity, DriverFilter> {
  constructor() {
    super(DriverFilter);
    this.baseService = AppInjector.get(DriverService);
  }
  baseService: DriverService;
  reportType = ReportType.reportDrivers;
  // Ds các cột cần tính tổng
  columnsSummary = ['FK_CompanyID', 'FK_DepartmentID', 'Flags'];

  columnsGridRequired: ColumnsOptions[] = [
    { title: 'STT', field: 'rowNumber', isCommand: false },
    { title: 'Công ty', field: 'FK_CompanyID', isCommand: false },
  ];

  /**
   * Danh sách cột có thể ẩn hiện của lưới
   */
  columnsGridCustom: ColumnsOptions[] = [
    {
      title: 'Phòng ban',
      field: 'FK_DepartmentID',
      visible: true,
      isCommand: false,
    },
    { title: 'Mã NV', field: 'EmployeeCode', visible: true, isCommand: false },
    {
      title: 'Tên hiển thị',
      field: 'DisplayName',
      visible: true,
      isCommand: false,
    },
    { title: 'Tên đăng nhập', field: 'Name', visible: true, isCommand: false },
    {
      title: 'Ngày sinh nhật',
      field: 'Birthday',
      visible: true,
      isCommand: false,
    },
    { title: 'Flags', field: 'Flags', visible: true, isCommand: false },
    { title: 'Sửa', field: 'updateCommand', visible: true, isCommand: true },
    { title: 'Xóa', field: 'deleteCommand', visible: true, isCommand: true },
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

  exportExcelFromServer(option: ExportExcelOption): Promise<void> {
    option.InputData = {
      keyword: this.baseFilter.searchContent,
      pageIndex: this.baseFilter.currentPager.pageIndex,
      pageSize: this.baseFilter.currentPager.pageSize,
    };
    return this.baseService
      .exportExcelFromServer(option)
      .toPromise()
      .then((dataRe: Response) => {
        const binaryData = [];
        binaryData.push(dataRe);
        const blob = new Blob(binaryData, { type: 'application/octet-stream' });
        const urlFile = window.URL.createObjectURL(blob);
        FileSaver.saveAs(blob, option.Template.FileName + '.xlsx');
      });
  }
}
