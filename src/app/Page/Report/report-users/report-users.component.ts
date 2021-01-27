import { Component, OnInit, ViewChild } from '@angular/core';
import { DriversManager } from 'src/app/BLL/DriversManager/DriversManager';
import { BaseReport } from 'src/app/Common/base-report';
import { DriverEntity } from 'src/app/entities/Driver/Driver';
import { DriverFilter } from '../../../entities/Driver/DriverFilter';
import { CRUDBase } from '../../../Core/curd-base';
import { UserEntity } from '../../../entities/Users/User';
import { UsersManager } from '../../../BLL/UserManager/UsersManager';
import { TwoColumnComponent } from '../BaseReport/two-column/two-column.component';
import { DriverEditComponent } from '../report-drivers/driver-edit/driver-edit.component';
import { Pager } from 'src/app/Core/pager';

@Component({
  selector: 'app-report-users',
  templateUrl: './report-users.component.html',
  styleUrls: ['./report-users.component.scss'],
})
export class ReportUsersComponent
  extends CRUDBase<UserEntity, UsersManager, DriverFilter>
  implements OnInit {
  public title = 'Danh sách người dùng';
  public modalTitle = 'Thêm mới người dùng';
  public reportTitle = 'Danh sách người dùng';
  public pageSize = 10;
  public searchContent = '';
  public isMasterDetail = true;
  @ViewChild(TwoColumnComponent) form: TwoColumnComponent;
  // Phân quyền
  public permissionKeyNameAdd = -1;
  public permissionKeyNameOption = 2;
  public permissionKeyNameUpdate = -1;
  public permissionKeyNameDelete = -1;
  public permissionKeyNameExport = 5;

  constructor() {
    super(UsersManager, UserEntity);
  }

  ngOnInit(): void {}

  /**
   * Thiết lập thông tin đầu vào
   * @param pager thông tin trang
   */
  setDataInput(pager: Pager): void {
    super.setDataInput(pager);
    this.baseManager.baseFilter.searchContent = this.searchContent;
    this.baseManager.baseFilter.columnsSummary = this.baseManager.columnsSummary.join(
      ','
    );
  }

  setHeaderReport(): void {
    super.setHeaderReport();
    this.reportContent = this.searchContent;
    this.reportTitle = 'Danh sách người dùng';
  }

  /**
   * Sự kiện command trên lưới
   */
  public onRowComand_Click(event: {
    action: string;
    dataItem: UserEntity;
    rowIndex: number;
  }): void {
    switch (event.action) {
      case 'edit':
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Sửa thông tin người dùng';
        this.form.edit();
        break;
      case 'remove':
        this.currentDataModel = event.dataItem;
        this.modalTitle = 'Xóa thông tin người dùng';
        this.form.edit();
        break;
    }
  }
}
