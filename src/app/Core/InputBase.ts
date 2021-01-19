import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { BaseService } from '../Services/Base/base.service';
import { GeneralBaseReport } from './GeneralBaseReport';
import { Pager } from './pager';
import { SaveType } from '../Enum/save-type.enum';
export class InputBase<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> extends GeneralBaseReport<TEntity, TManager, TFilter> {
  public permissionKeyNameAdd: number;

  public permissionKeyNameUpdate: number;

  public permissionKeyNameDelete: number;

  public isNew: boolean;

  public currentEntity: TEntity = new this.cObj();

  public validateDataBeChanged(): boolean {
    return true;
  }

  public getDetail(): TEntity {
    return null;
  }

  public async create(entity: TEntity): Promise<boolean> {
    return true;
  }

  public async update(entity: TEntity): Promise<boolean> {
    return true;
  }

  public async delete(entity: TEntity): Promise<boolean> {
    return true;
  }

  public async lock(entity: TEntity): Promise<boolean> {
    return true;
  }
  public onCreate_Click(): void {}
  public async onSave_Click(saveType: SaveType): Promise<void> {}
  public onRowComand_Click(event: any): void {}
  public onLock_Click(): void {}
}
