import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { BaseService } from '../Services/Base/base.service';
import { GeneralBaseReport } from './GeneralBaseReport';
export class ReportBase<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> extends GeneralBaseReport<TEntity, TManager, TFilter> {}
