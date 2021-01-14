import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';

export class BaGrid extends GridComponent {
  data: Array<any> | BAGridDataResult;
}

export interface BAGridDataResult extends GridDataResult {
  data: any[];
  /**
   * The total number of records that are available.
   */
  total: number;
}
