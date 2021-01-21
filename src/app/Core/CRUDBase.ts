import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { BaseService } from '../Services/Base/base.service';
import { GeneralBaseReport } from './GeneralBaseReport';
import { Pager } from './pager';
import { SaveType } from '../Enum/save-type.enum';
import { Observable } from 'rxjs';
export class CRUDBase<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> extends GeneralBaseReport<TEntity, TManager, TFilter> {
  public permissionKeyNameAdd: number;

  public permissionKeyNameUpdate: number;

  public permissionKeyNameDelete: number;

  public isNew: boolean;

  public currentDataModel: TEntity = new this.cObj();

  public validateDataBeChanged(): boolean {
    return true;
  }

  public getDetail(): TEntity {
    return null;
  }

  public async create(entity: TEntity): Promise<boolean> {
    return this.baseManager.addNew(entity);
  }

  public async update(entity: TEntity): Promise<boolean> {
    return this.baseManager.update(entity);
  }

  public async delete(id: any): Promise<boolean> {
    return this.baseManager.delete(id);
  }

  public async lock(entity: TEntity): Promise<boolean> {
    return true;
  }
  public onCreate_Click(): void {
    this.currentDataModel = new this.cObj();
  }
  public async onSave_Click(saveType: SaveType): Promise<void> {}
  public onRowComand_Click(event: any): void {}
  public onLock_Click(): void {}
}
