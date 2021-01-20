import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DriverEntity } from 'src/app/entities/Driver/Driver';
import { DriversManager } from '../../../BLL/DriversManager/DriversManager';
import { DriverFilter } from '../../../entities/Driver/DriverFilter';
import { InputBase } from '../../../Core/InputBase';
import { TwoColumnComponent } from '../BaseReport/two-column/two-column.component';
import { MessageType } from 'src/app/Enum/message-type.enum';
import { SaveType } from '../../../Enum/save-type.enum';
import { DateTime } from '../../../Helper/DateTimeHelper';

@Component({
  selector: 'app-report-drivers',
  templateUrl: './report-drivers.component.html',
  styleUrls: ['./report-drivers.component.scss'],
})
export class ReportDriversComponent
  extends InputBase<DriverEntity, DriversManager, DriverFilter>
  implements OnInit, AfterViewInit {
  /**
   * Danh sách properties override
   */
  public title = 'Danh sách lái xe';
  public modalTitle = 'Thêm mới lái xe';
  public reportTitle = 'Danh sách lái xe';
  public reportDate = new DateTime(new Date()).toFormat();
  public reportVehicle = 'Vehicles plate';
  public pageSize = 10;
  @ViewChild(TwoColumnComponent) form: TwoColumnComponent;

  constructor() {
    super(DriversManager, DriverEntity);
  }
  ngAfterViewInit(): void {
    this.getColumnsGridCustom();
  }

  // Hàm khởi tạo trang
  public ngOnInit(): void {}

  validateDataBeChanged(): boolean {
    if (
      (this.currentEntity.DisplayName === '' ||
        this.currentEntity.DisplayName === undefined) &&
      (this.currentEntity.EmployeeCode === '' ||
        this.currentEntity.EmployeeCode === undefined)
    ) {
      return false;
    }
    return true;
  }

  async create(entity: DriverEntity): Promise<boolean> {
    return await this.baseManager.addNewDriver(entity);
  }

  async update(entity: DriverEntity): Promise<boolean> {
    return await this.baseManager.updateDriver(entity);
  }

  async delete(id: any): Promise<boolean> {
    return await this.baseManager.deleteDriver(id);
  }
  // Hàm thực hiện lưu khi ấn nút lưu ở modal
  public async onSave_Click(saveType: SaveType): Promise<void> {
    if (!this.validateDataBeChanged()) {
      this.form.showMessageBox(
        MessageType.warning,
        'Chưa điền đầy đủ thông tin'
      );
      return;
    }
    // Theem moiws
    if (saveType === SaveType.create) {
      const isSucess = await this.create(this.currentEntity);
      if (!isSucess) {
        this.form.showMessageBox(
          MessageType.error,
          'Thêm mới không thành công'
        );
      } else {
        if (!this.form.isContinue) {
          this.form.close();
        } else {
          this.form.showMessageBox(
            MessageType.success,
            'Thêm mới lái xe thành công'
          );
          this.currentEntity = new DriverEntity();
        }
        this.bindData();
      }
    } else if (saveType === SaveType.update) {
      // Cập nhật
      const isSucess = await this.update(this.currentEntity);
      if (!isSucess) {
        this.form.showMessageBox(
          MessageType.error,
          'Cập nhật không thành công'
        );
      } else {
        if (!this.form.isContinue) {
          this.form.close();
        } else {
          this.form.showMessageBox(
            MessageType.success,
            'Cập nhật lái xe thành công'
          );
          this.currentEntity = new DriverEntity();
        }
        this.bindData();
      }
    } else if (saveType === SaveType.delete) {
      // Remove
      const isSucess = await this.delete(this.currentEntity.PK_EmployeeID);
      if (!isSucess) {
        this.form.showMessageBox(MessageType.error, 'Xóa không thành công');
      } else {
        this.form.close();
        this.bindData();
      }
    }
  }

  /**
   * Sự kiện ấn nút thêm mới để mở popup thêm mới
   */
  public onCreate_Click(): void {
    this.modalTitle = 'Thêm mới lái xe';
  }
  /**
   * Sự kiện command trên lưới
   */
  public onRowComand_Click(event: {
    action: string;
    dataItem: DriverEntity;
    rowIndex: number;
  }): void {
    switch (event.action) {
      case 'edit':
        this.currentEntity = event.dataItem;
        this.modalTitle = 'Sửa thông tin lái xe';
        this.form.edit();
        break;
      case 'remove':
        this.currentEntity = event.dataItem;
        this.modalTitle = 'Xóa thông tin lái xe';
        this.form.edit();
        break;
    }
  }
}
