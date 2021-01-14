import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  DataStateChangeEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { Driver, DriverEntity } from 'src/app/entities/Driver/Driver';
import { DriversManager } from '../../../BLL/DriversManager/DriversManager';
import { BaseReport } from '../../../Common/base-report';

@Component({
  selector: 'app-report-drivers',
  templateUrl: './report-drivers.component.html',
  styleUrls: ['./report-drivers.component.scss'],
})
export class ReportDriversComponent
  extends BaseReport<DriversManager, Driver>
  implements OnInit, AfterViewInit {
  private driverService: DriversManager;
  public title = 'Danh sách lái xe';
  public modalTitle = 'Thêm mới lái xe';
  public pageSize = 15;
  @ViewChild(GridComponent) private grid: GridComponent;
  constructor() {
    super(DriversManager, Driver);
  }
  public ngAfterViewInit(): void {
    this.grid.dataStateChange.subscribe(
      ({ skip, take }: DataStateChangeEvent) => {
        this.skip = skip;
        this.pageSize = take;
      }
    );
  }

  // Hàm khởi tạo trang
  public ngOnInit(): void {}

  // Hàm thực hiện lưu khi ấn nút lưu ở modal
  public onSave_Click(messID: number): void {
    // Nếu thêm mới thành công
    if (this.baseManager.addNewDriver(this.currentObject)) {
      this.currentObject = new Driver();
      super.onSave_Click(messID);
    }
  }
}
