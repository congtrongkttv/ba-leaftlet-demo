import { Component, Input, OnInit } from '@angular/core';
import { BaseEntity } from '../../../../entities/Base/BaseEntity';

@Component({
  selector: 'app-grid-detail',
  templateUrl: './grid-detail.component.html',
  styleUrls: ['./grid-detail.component.scss'],
})
export class GridDetailComponent implements OnInit {
  @Input() fieldsDetail: any[];
  @Input() detail: any;
  @Input() viewDetail: (item: any) => Promise<any[]>;

  public view: any[] = [];
  public loading = false;

  constructor() {}

  ngOnInit(): void {
    this.getViewDetail();
  }

  async getViewDetail(): Promise<void> {
    this.loading = true;
    this.view = await this.viewDetail(this.detail);
    this.loading = false;
  }
}
