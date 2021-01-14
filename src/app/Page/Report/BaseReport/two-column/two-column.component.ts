import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppInjector } from '../../../../app.module';
@Component({
  selector: 'app-two-column',
  templateUrl: './two-column.component.html',
  styleUrls: ['./two-column.component.scss'],
})
export class TwoColumnComponent implements OnInit {
  constructor() {}
  @Input() pageTitle: string;
  @Input() modalTitle: string;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSearch = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSave = new EventEmitter<any>();
  modalService: NgbModal;
  ngOnInit(): void {
    this.modalService = AppInjector.get(NgbModal);
  }
  /**
   * Sự kieenj mowr modal để thêm mới hoặc sửa
   * @param modal tên modal cần mở
   */
  onAdd_Click(modal): void {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
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
  onSave_Click(): void {
    this.onSave.emit(1);
  }
}
