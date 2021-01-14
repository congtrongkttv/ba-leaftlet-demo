import { AdminBaseManager } from '../BaseManager/AdminBaseManager';
import { Driver } from '../../entities/Driver';
import { DriverService } from '../../Services/driver/driver.service';
import { AppInjector } from '../../app.module';
export class DriversManager extends AdminBaseManager<Driver> {
  driverService: DriverService;
  constructor() {
    super();
    this.driverService = AppInjector.get(DriverService);
  }

  GetDataReport(): Driver[] {

    return this.driverService?.getAllData().filter(x => x.RowIndex >= );
  }
  GetRowCountReport(): number {
    return this.driverService?.getAllData().length;
  }
}
