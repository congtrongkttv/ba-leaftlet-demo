import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseFilter } from '../entities/Base/BaseFilter';

import { Pager } from './pager';
export class GeneralBaseReport<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> {
  constructor(
    private bManager: new () => TManager,
    protected cObj: new () => TEntity
  ) {
    this.checkPermission();
  }

  //#region PROPERTIES
  public permissionKeyNameView: number;

  public permissionKeyNameExport: number;

  public permissionKeyNameOption: number;

  public baseManager: TManager = new this.bManager();

  // danh sách dữ liệu
  public dataSource: TEntity[];
  // Số dòng dữ liệu thực
  public rowCount: number;

  public isLandscape: boolean;

  public reportTitle: string;

  public reportContent: string;

  public reportName: string;

  public daySupport: number;

  public columnsGrid: [];

  public columnsGridRequired: [];

  public columnsGridCustom: [];

  public columnsGridExclude: [];

  // Grid properties
  public pageSize = 10;
  public pageIndex = 0;
  public dataGrid: GridDataResult = { data: [], total: 0 };
  public isLoading = false;
  public skip = 0;

  //#endregion

  //#region METHODS
  /**
   * check quyền
   */
  public checkPermission(): void {}
  /**
   * Validate dữ liệu đầu vào tìm kiếm
   */
  public validateData(): boolean {
    return true;
  }
  /**
   * Set dữ liệu tìm kiếm khi tìm kiếm
   */
  public setDataInput(): void {
    const pager = new Pager(this.pageSize, this.pageIndex);
    this.baseManager.currentPager = pager;
  }

  /**
   * Lấy dữ liệu
   */
  public async getData(): Promise<TEntity[]> {
    this.setDataInput();
    return await this.baseManager.getDataReport();
  }
  /**
   * Lấy số dòng của tất cả dữ liệu theo đầu vào tìm kiếm
   */
  public async getRowCount(): Promise<number> {
    return await this.baseManager.getRowCountReport();
  }
  /**
   * Xuất váo cáo dạng excel
   */
  public exportExcel(): void {}
  /**
   * Xuất báo cáo dạng pdf
   */
  public exportPdf(): void {}
  /**
   * Khi tìm kiếm thì cho skip và page index về mặc định ban đầu
   */
  public resetGrid(): void {
    this.pageIndex = 0;
    this.skip = 0;
  }
  /**
   * Lấy dữ liệu và bind to grid
   */
  public async bindData(): Promise<void> {
    if (this.validateData) {
      this.isLoading = true;
      this.dataSource = await this.getData();
      this.rowCount = await this.getRowCount();
      this.dataGrid = { data: this.dataSource, total: this.rowCount };
      this.isLoading = false;
    }
  }
  //#endregion

  //#region EVENTS
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageIndex = event.skip / this.pageSize;
    this.bindData();
  }
  /**
   * sw kiện tìm kiếm dữ liệu
   */
  public onSearch_Click(): void {
    this.resetGrid();
    this.bindData();
  }
  //#endregion
}
