import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
export class DriversManager extends BaseManager<DriverEntity> {
  driverService: DriverService;

  constructor() {
    super();
    this.driverService = AppInjector.get(DriverService);
  }

  async getDataReport(): Promise<any> {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.pager = this.currentPager;
    filter.contentSearch = this.searchContent;
    // Lấy dữ liệu
    let entities = [];
    await this.driverService.getData(filter).then((x: any) => {
      entities = x.data;
      let i = 0;
      entities.forEach((dr: any) => {
        i++;
        dr.rowIndex = this.currentPager.startRow - 1 + i;
      });
    });
    return entities;
  }

  async getRowCountReport(): Promise<number> {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.contentSearch = this.searchContent;
    // Lấy dữ liệu
    let count = 0;
    await this.driverService.getRowCount(filter).then((x: any) => {
      count = x.data;
    });
    return count;
  }

  addNewDriver(entity: DriverEntity): boolean {
    return this.driverService.AddNew(entity);
  }
}
