import { Pager } from '../../Core/pager';
export class BaseFilter {
  companyID: number;
  fromDate: Date;
  toDate: Date;
  vehicleIDs: string;
  pager: Pager;
}
