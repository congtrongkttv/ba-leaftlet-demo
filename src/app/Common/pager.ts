export class Pager {
  constructor(pageSize: number, pageIndex: number) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.startRow = this.pageSize * this.pageIndex + 1;
    this.endRow = this.pageSize * (this.pageIndex + 1);
  }
  pageSize: number;
  pageIndex: number;
  startRow: number;
  endRow: number;
}
