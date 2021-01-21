import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { time } from 'console';
import { MessageType } from 'src/app/Enum/message-type.enum';
import { AppInjector } from '../../../../app.module';
import { SaveType } from '../../../../Enum/save-type.enum';
import { CurrentData } from '../../../tracking/tracking.component';
@Component({
  selector: 'app-two-column',
  templateUrl: './two-column.component.html',
  styleUrls: ['./two-column.component.scss'],
})
export class TwoColumnComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() modalTitle: string;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSearch = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCreate = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSave = new EventEmitter<any>();
  @Output() onSaveCustomColumns = new EventEmitter<any>();
  @Input() messageContent;
  @Input() messageType: number;
  @Input() isShowMessageBox: boolean;
  @Input() isShowCustomColumn: boolean;
  @Input() enableAdd: boolean;
  @Input() enableOption: boolean;
  @Input() columnsCustom: { title: any; feild: any; checked: boolean }[];
  public permissions = CurrentData.permissions;
  @ViewChild('mymodal', { static: true }) input: ElementRef;

  // Thêm mới hay cập nhật
  isNew = false;
  // Lưu và thêm mới
  isContinue = false;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  /**
   * Sự kieenj mowr modal để thêm mới
   */
  create(): void {
    this.isNew = true;
    this.modalService.open(this.input, { ariaLabelledBy: 'modal-basic-title' });
    // firing sang component cha để reset lại đối tượng đang làm việc
    this.onCreate.emit();
  }
  /**
   * Sự kieenj mowr modal để sửa
   */
  edit(): void {
    this.isNew = false;
    this.modalService.open(this.input, { ariaLabelledBy: 'modal-basic-title' });
  }
  /**
   * Sự kieenj đóng modal
   */
  close(): void {
    this.modalService.dismissAll();
  }

  /**
   * Sự kiện tìm kiếm
   */
  onSearch_Click(): void {
    this.onSearch.emit();
  }

  /**
   * Sự kiện ấn nút lưu
   */
  onSave_Click(isAddMore: boolean): void {
    if (this.isNew) {
      this.onSave.emit(SaveType.create);
    } else {
      this.onSave.emit(SaveType.update);
    }
    this.isContinue = isAddMore;
  }
  /**
   * Sự kiện ấn nút xóa
   */
  onDelete_Click(): void {
    if (confirm('Bạn có muốn xóa lái xe này không?')) {
      this.onSave.emit(SaveType.delete);
    }
  }

  onSaveCustomColumns_Click(): void {
    this.onSaveCustomColumns.emit();
    this.isShowCustomColumn = false;
  }

  // Hiển thị thông báo
  showMessageBox(messageType: MessageType, content: string): void {
    this.isShowMessageBox = true;
    this.messageContent = content;
    this.messageType = messageType;
    const timer = setTimeout(() => {
      this.hideMessageBox();
    }, 3000);
  }
  // ẩn thông báo
  hideMessageBox(): void {
    this.isShowMessageBox = false;
    this.messageContent = '';
  }

  showCustomColumn(): void {
    this.isShowCustomColumn = !this.isShowCustomColumn;
  }
}
