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
import { CRUDBase } from '../../../Core/CRUDBase';
import { TwoColumnComponent } from '../BaseReport/two-column/two-column.component';
import { MessageType } from 'src/app/Enum/message-type.enum';
import { SaveType } from '../../../Enum/save-type.enum';
import { DateTime } from '../../../Helper/DateTimeHelper';
import { Pager } from 'src/app/Core/pager';
import { get } from 'http';
import { FieldsControl } from 'src/app/Helper/fields-control';

@Component({
  selector: 'app-report-drivers',
  templateUrl: './report-drivers.component.html',
  styleUrls: ['./report-drivers.component.scss'],
})
export class ReportDriversComponent
  extends CRUDBase<DriverEntity, DriversManager, DriverFilter>
  implements OnInit, AfterViewInit {
  constructor() {
    super(DriversManager, DriverEntity);
  }
  @ViewChild(TwoColumnComponent) form: TwoColumnComponent;
  public searchContent = '';

  /**
   * Danh sách properties override
   */
  public title = 'Danh sách lái xe';
  public modalTitle = 'Thêm mới lái xe';
  public reportTitle = 'Danh sách lái xe';
  public pageSize = 10;

  // Phân quyền
  public permissionKeyNameAdd = 1;
  public permissionKeyNameOption = 2;
  public permissionKeyNameUpdate = 3;
  public permissionKeyNameDelete = 4;
  public permissionKeyNameExport = 5;

  ngAfterViewInit(): void {
    this.getColumnsGridCustom();
  }

  // Hàm khởi tạo trang
  public ngOnInit(): void {}

  /**
   * Thiết lập thông tin đầu vào
   * @param pager thông tin trang
   */
  setDataInput(pager: Pager): void {
    super.setDataInput(pager);
    this.baseManager.baseFilter.searchContent = this.searchContent;
    this.baseManager.baseFilter.feildSum = this.baseManager.columnsSummaryItems.join(
      ','
    );
  }

  setHeaderReport(): void {
    super.setHeaderReport();
    this.reportContent = this.searchContent;
  }

  /**
   * validate dữ liệu trước khi thêm mới / sửa
   */
  validateDataBeChanged(): boolean {
    if (
      (this.currentDataModel.DisplayName === '' ||
        this.currentDataModel.DisplayName === undefined) &&
      (this.currentDataModel.EmployeeCode === '' ||
        this.currentDataModel.EmployeeCode === undefined)
    ) {
      return false;
    }
    return true;
  }

  // Hàm thực hiện lưu khi ấn nút lưu ở modal
  public async onSave_Click(saveType: SaveType): Promise<void> {
    if (!this.validateDataBeChanged()) {
      this.form.showMessageBoxOnPopup(
        MessageType.warning,
        'Chưa điền đầy đủ thông tin'
      );
      return;
    }
    // Theem moiws
    if (saveType === SaveType.create) {
      const isSucess = await this.create(this.currentDataModel);
      if (!isSucess) {
        this.form.showMessageBoxOnPopup(
          MessageType.error,
          'Thêm mới lái xe không thành công'
        );
      } else {
        if (!this.form.isContinue) {
          this.form.showMessageBoxOnPage(
            MessageType.success,
            'Thêm mới lái xe thành công'
          );
          this.form.close();
        } else {
          this.form.showMessageBoxOnPopup(
            MessageType.success,
            'Thêm mới lái xe thành công'
          );
          this.currentDataModel = new DriverEntity();
        }

        this.bindData();
      }
    } else if (saveType === SaveType.update) {
      // Cập nhật
      const isSucess = await this.update(this.currentDataModel);
      if (!isSucess) {
        this.form.showMessageBoxOnPopup(
          MessageType.error,
          'Cập nhật không thành công'
        );
      } else {
        if (!this.form.isContinue) {
          this.form.close();
          this.form.showMessageBoxOnPage(
            MessageType.success,
            'Cập nhật lái xe thành công'
          );
        } else {
          this.form.showMessageBoxOnPopup(
            MessageType.success,
            'Cập nhật lái xe thành công'
          );
          this.currentDataModel = new DriverEntity();
        }

        this.bindData();
      }
    } else if (saveType === SaveType.delete) {
      // Remove
      if (confirm('Bạn có muốn xóa lái xe này không?')) {
        const isSucess = await this.delete(this.currentDataModel.PK_EmployeeID);
        if (!isSucess) {
          this.form.showMessageBoxOnPopup(
            MessageType.error,
            'Xóa không thành công'
          );
        } else {
          this.form.showMessageBoxOnPage(MessageType.success, 'Xóa thành công');
          this.form.close();
          this.bindData();
        }
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
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Sửa thông tin lái xe';
        this.form.edit();
        break;
      case 'remove':
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Xóa thông tin lái xe';
        this.form.edit();
        break;
    }
  }
}
