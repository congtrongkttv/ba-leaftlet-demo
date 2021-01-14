import { Pager } from '../../Common/pager';
/**
 * Trang quản lý để xử lý logic, truy xuất dữ liệu
 * @template TEntity ĐỐi tượng trả về
 */
export class BaseManager<TEntity> {
  // ID Công ty
  public companyID: number;
  // Từ ngày
  public fromDate: Date;
  // Đến ngày
  public toDate: Date;
  // ds mã xe
  public vehicleIDs: string;
  // ds biển số xe
  public vehiclePlates: string;
  // Nọi dung tìm kiếm
  public searchContent = '';
  // Thông tin pager
  public currentPager: Pager;
  // Thông tin pager: Sử dụng khi get Rowcount
  public pagerAll: Pager = new Pager(Number.MAX_SAFE_INTEGER, 0);

  /**
   * Lấy dữ liệu
   */
  public getDataReport(): TEntity[] {
    return [];
  }

  /**
   * Lấy số dòng dữ liệu để phân trang custom
   */
  public getRowCountReport(): number {
    return 0;
  }
}
