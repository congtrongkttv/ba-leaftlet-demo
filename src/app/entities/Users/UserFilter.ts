import { BaseEntity } from '../Base/BaseEntity';
import { BaseFilter } from '../Base/BaseFilter';
export class UserFilter extends BaseFilter {
  searchContent: string;
  columnsSummary: string;
  constructor() {
    super();
  }
}
