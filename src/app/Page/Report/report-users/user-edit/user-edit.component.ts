import { Component, Input, OnInit } from '@angular/core';
import { FieldsControl } from 'src/app/Helper/fields-control';
import { UserEntity } from '../../../../entities/Users/User';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  @Input() entity: UserEntity;
  @Input() fields: FieldsControl[];
  constructor() {}

  ngOnInit(): void {}
}
