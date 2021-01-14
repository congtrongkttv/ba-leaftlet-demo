import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
export class DriversManager extends BaseManager<Driver> {
  driverService: DriverService;

  constructor() {
    super();
    this.driverService = AppInjector.get(DriverService);
  }

  getDataReport(): Driver[] {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.pager = this.currentPager;
    filter.contentSearch = this.searchContent;
    // Lấy dữ liệu
    return this.driverService.getData(filter);
  }

  getRowCountReport(): number {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.pager = this.pagerAll;
    filter.contentSearch = this.searchContent;
    return this.driverService.getData(filter).length;
  }

  addNewDriver(entity: Driver): boolean {
    return this.driverService.AddNew(entity);
  }
}
