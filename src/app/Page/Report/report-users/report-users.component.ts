import { Component, OnInit } from '@angular/core';
import { DriversManager } from 'src/app/BLL/DriversManager/DriversManager';
import { BaseReport } from 'src/app/Common/base-report';
import { DriverEntity } from 'src/app/entities/Driver/Driver';

@Component({
  selector: 'app-report-users',
  templateUrl: './report-users.component.html',
  styleUrls: ['./report-users.component.scss'],
})
export class ReportUsersComponent
  extends BaseReport<DriversManager, DriverEntity>
  implements OnInit {
  public title = 'Danh sách người dùng';
  public modalTitle = 'Thêm mới người dùng';
  public pageSize = 10;
  constructor() {
    super(DriversManager, DriverEntity);
  }

  ngOnInit(): void {}
}
