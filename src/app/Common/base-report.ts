import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { Pager } from './pager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { route } from '../app-routing.module';
import { DateTime } from '../Helper/DateTimeHelper';
export class BaseReport<
  TManager extends BaseManager<TEntity>,
  TEntity extends BaseEntity
> {
  constructor(
    private bManager: new () => TManager,
    private currentObj: new () => TEntity
  ) {
    this.initPage();
  }
  //#region  PROPERTIES
  // trang quản lý tìm kiếm và lấy dữ liệu từ service
  public baseManager = new this.bManager();
  // danh sách báo cáo
  public dataSource: TEntity[];
  // Đầu vào cho Grid để hiển thị dữ liệu và phân trang
  public dataGrid: GridDataResult;
  // Số dòng báo cáo
  public rowCount: number;
  // số lượng dòng trên 1 trang
  public pageSize = 10;
  // Số TT trang hiện tại
  public pageIndex = 0;
  // Skip để phân trang của kendo
  public skip = 0;
  // ĐỐi tượng dùng để thêm mới hoặc xóa/sửa
  public currentObject: TEntity = new this.currentObj();
  //#endregion

  //#region METHODS
  /**
   * hàm khởi tạo trang
   */
  public initPage(): void {
    // Nếu không có quyền view cho ra trang mặc định
    if (!this.checkPermission()) {
      route.navigate(['/']);
    }
  }

  /**
   * hàm khởi tạo dữ liệu cho trang
   */
  public initPageData(): void {
    // Set dữ liệu đầu vào cho các control tìm kiếm
    this.baseManager.fromDate = new Date();
    this.baseManager.toDate = new Date();
  }

  checkPermission(): boolean {
    return true;
  }

  /**
   * Xóa dữ liệu trang
   */
  public clearData(): void {}

  /**
   * Kiểm tra đầu vào tìm kiếm trước kkhi lấy dữ liệu
   */
  public validateData(): boolean {
    return true;
  }
  /**
   * Dữ liệu đầu vào cho báo cáo
   */
  public SetDataInput(): void {
    const pager = new Pager(this.pageSize, this.pageIndex);
    this.baseManager.currentPager = pager;
  }

  /**
   * Lấy dữ liệu
   */
  public GetData(): TEntity[] {
    this.SetDataInput();
    return this.baseManager.getDataReport();
  }

  /**
   * Lấy số dòng dữ liệu để phân trang
   */
  public GetRowCount(): number {
    return this.baseManager.getRowCountReport();
  }
  // Hàm lấy dữ liệu để fill lên lưới
  public bindData(): void {
    if (this.validateData) {
      this.dataSource = this.GetData();
      this.rowCount = this.GetRowCount();
      this.dataGrid = { data: this.dataSource, total: this.rowCount };
    }
  }

  //#endregion

  //#region EVENTS
  /**
   * sw kiện tìm kiếm dữ liệu
   */
  public onSearch_Click(): void {
    this.bindData();
  }
  /**
   *
   * @param messID
   */
  public onSave_Click(messID: number): void {}

  public onAdd_Click(): void {}
  /**
   * Sự kiện thayy đổi trang trên lưới
   */
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageIndex = event.skip / this.pageSize;
    this.bindData();
  }
  //#endregion
}
