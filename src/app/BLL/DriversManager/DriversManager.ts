import { BaseManager } from '../BaseManager/BaseManager';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
export class DriversManager extends BaseManager<DriverEntity, DriverFilter> {
  baseService: DriverService;
  constructor() {
    super();
    this.baseService = AppInjector.get(DriverService);
  }

  async getDataReport(): Promise<any> {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.pager = this.currentPager;
    filter.searchContent = this.searchContent;
    // Lấy dữ liệu
    let entities = [];
    return await this.baseService
      .getData(filter)
      .toPromise()
      .then((x: any) => {
        entities = x.Data;
        return entities;
      });
  }

  async getRowCountReport(): Promise<number> {
    // Các trường cần tìm kiếm
    const filter: DriverFilter = new DriverFilter();
    filter.searchContent = this.searchContent;
    // Lấy dữ liệu
    let count = 0;
    return await this.baseService
      .getRowCount(filter)
      .toPromise()
      .then((x: any) => {
        count = x.Data;
        return count;
      });
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
