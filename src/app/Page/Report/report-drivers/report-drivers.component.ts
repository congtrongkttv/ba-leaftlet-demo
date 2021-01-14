import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DataStateChangeEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { Driver, DriverEntity } from 'src/app/entities/Driver/Driver';
import { DriversManager } from '../../../BLL/DriversManager/DriversManager';
import { BaseReport } from '../../../Common/base-report';
import { DriverService } from '../../../Services/driver/driver.service';
import { BaseService } from '../../../Services/Base/base.service';

@Component({
  selector: 'app-report-drivers',
  templateUrl: './report-drivers.component.html',
  styleUrls: ['./report-drivers.component.scss'],
})
export class ReportDriversComponent
  extends BaseReport<DriversManager, DriverEntity>
  implements OnInit, AfterViewInit {
  /**
   * Danh sách properties override
   */
  public title = 'Danh sách lái xe';
  public modalTitle = 'Thêm mới lái xe';
  public pageSize = 10;
  @ViewChild(GridComponent) private grid: GridComponent;
  @Input() allData: () => Promise<ExcelExportData>;
  constructor() {
    super(DriversManager, DriverEntity);
  }
  public ngAfterViewInit(): void {}

  // Hàm khởi tạo trang
  public ngOnInit(): void {}

  // Hàm thực hiện lưu khi ấn nút lưu ở modal
  public onSave_Click(messID: number): void {
    // Nếu thêm mới thành công
    if (this.baseManager.addNewDriver(this.currentObject)) {
      this.currentObject = new DriverEntity();
      super.onSave_Click(messID);
    }
  }
}
