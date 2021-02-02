import { BaseManager } from '../BLL/BaseManager/base-manager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { GeneralBaseReport } from './general-base-report';
export abstract class ReportBase<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> extends GeneralBaseReport<TEntity, TManager, TFilter> {
  validateData(): boolean {
    return true;
  }
}
