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
import { SaveType } from '../../../../Enum/save-type.enum';
import { CurrentData } from '../../../tracking/tracking.component';
@Component({
  selector: 'app-form-report-base',
  templateUrl: './form-report-base.component.html',
  styleUrls: ['./form-report-base.component.scss'],
})
export class FormReportBaseComponent implements OnInit {
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
  @Input() isShowMessagePopup: boolean;
  @Input() isShowMessagePage: boolean;
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
  create(size?: 'sm' | 'md' | 'lg' | 'xl' | string): void {
    this.isNew = true;
    this.isContinue = true;
    this.modalService.open(this.input, {
      backdrop: 'static',
      size: size ?? 'md',
      animation: true,
      scrollable: true,
    });
    // firing sang component cha để reset lại đối tượng đang làm việc
    this.onCreate.emit();
  }
  /**
   * Sự kieenj mowr modal để sửa
   */
  edit(size?: 'sm' | 'md' | 'lg' | 'xl' | string): void {
    this.isNew = false;
    this.modalService.open(this.input, {
      backdrop: 'static',
      size: size ?? 'md',
      animation: true,
      scrollable: true,
    });
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
    this.onSave.emit(SaveType.delete);
  }

  onSaveCustomColumns_Click(isSave: boolean): void {
    this.onSaveCustomColumns.emit(isSave);
    this.isShowCustomColumn = false;
  }

  // Hiển thị thông báo
  showMessageBoxOnPopup(messageType: MessageType, content: string): void {
    this.isShowMessagePopup = true;
    this.isShowMessagePage = false;
    this.messageContent = content;
    this.messageType = messageType;
    const timer = setTimeout(() => {
      this.hideMessageBoxOnPopup();
    }, 3000);
  }
  // ẩn thông báo
  hideMessageBoxOnPopup(): void {
    this.isShowMessagePopup = false;
    this.isShowMessagePage = false;
    this.messageContent = '';
  }

  // Hiển thị thông báo
  showMessageBoxOnPage(messageType: MessageType, content: string): void {
    this.isShowMessagePopup = false;
    this.isShowMessagePage = true;
    this.messageContent = content;
    this.messageType = messageType;
    const timer = setTimeout(() => {
      this.hideMessageBoxOnPage();
    }, 3000);
  }
  // ẩn thông báo
  hideMessageBoxOnPage(): void {
    this.isShowMessagePopup = false;
    this.isShowMessagePage = false;
    this.messageContent = '';
  }

  showCustomColumn(): void {
    this.isShowCustomColumn = !this.isShowCustomColumn;
  }
}
