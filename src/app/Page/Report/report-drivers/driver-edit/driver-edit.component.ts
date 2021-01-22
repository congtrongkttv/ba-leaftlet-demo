import { FieldsControl } from './../../../../Helper/fields-control';
import { Component, Input, OnInit } from '@angular/core';
import { DriverEntity } from '../../../../entities/Driver/Driver';

@Component({
  selector: 'app-driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.scss'],
})
export class DriverEditComponent implements OnInit {
  constructor() {}

  @Input() entity: DriverEntity;
  @Input() fields: FieldsControl[];

  ngOnInit(): void {}
}
