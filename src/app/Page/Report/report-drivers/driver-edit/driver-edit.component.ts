import { FieldsControl } from './../../../../Helper/fields-control';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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

  @ViewChild('required') txtNumber: ElementRef;

  public ngOnInit(): void {}

  public validateInput(): { success: boolean; message: string } {
    // if (this.txtNumber.nativeElement.value === '') {
    //   return {
    //     success: false,
    //     message: '',
    //   };
    // }
    return {
      success: true,
      message: '',
    };
  }
}
