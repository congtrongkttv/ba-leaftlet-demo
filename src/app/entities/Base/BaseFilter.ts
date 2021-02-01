import { Pager } from '../../Core/pager';
export class BaseFilter {
  // ID Công ty
  public companyID: number;

  // User ID
  public userID: string;

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
}
