import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverFilter } from '../../../entities/Driver/DriverFilter';
import { CRUDBase } from '../../../Core/curd-base';
import { UserEntity } from '../../../entities/Users/User';
import { UsersManager } from '../../../BLL/UserManager/UsersManager';
import { Pager } from 'src/app/Core/pager';
import { AuthorizeBase } from '../../../Core/authorize-base';
import { PermissionKeyNames } from 'src/app/Enum/permission-key-names.enum';

@Component({
  selector: 'app-report-users',
  templateUrl: './report-users.component.html',
  styleUrls: ['./report-users.component.scss'],
})
export class ReportUsersComponent
  extends CRUDBase<UserEntity, UsersManager, DriverFilter>
  implements OnInit {
  public pageTitle = 'Danh sách người dùng';
  public modalTitle = 'Thêm mới người dùng';
  public reportTitle = 'Danh sách người dùng';
  public pageSize = 10;
  public searchContent = '';
  public isMasterDetail = true;
  // Phân quyền
  authorized: AuthorizeBase = {
    canView: this.hasPermission(PermissionKeyNames.userView),
    canExport: this.hasPermission(PermissionKeyNames.userExport),
    canOption: this.hasPermission(PermissionKeyNames.userOption),
  };
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
