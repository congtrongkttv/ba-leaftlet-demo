import { BaseEntity } from '../Base/BaseEntity';
import { BaseFilter } from '../Base/BaseFilter';
export class DriverFilter extends BaseFilter {
  searchContent: string;
  feildSum: string;
  constructor() {
    super();
  }
}
