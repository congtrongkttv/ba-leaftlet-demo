import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { GeneralBaseReport } from './GeneralBaseReport';
import { SaveType } from '../Enum/save-type.enum';
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

  // Validate dữ liệu khi thêm mới hoặc cập nhật
  public validateDataBeChanged(): boolean {
    return true;
  }

  public getDetail(): TEntity {
    return null;
  }

  public async create(entity: TEntity): Promise<boolean> {
    if (this.validateDataBeChanged()) {
      return this.baseManager.addNew(entity);
    }
    return false;
  }

  public async update(entity: TEntity): Promise<boolean> {
    if (this.validateDataBeChanged()) {
      return this.baseManager.update(entity);
    }
    return false;
  }

  public async delete(id: any): Promise<boolean> {
    return this.baseManager.delete(id);
  }

  public async lock(entity: TEntity): Promise<boolean> {
    return true;
  }

  /**
   * Sự kiện ấn nút thêm mới để mở popup
   */
  public onCreate_Click(): void {
    // Khởi tọa lại đối tượng đang làm việc
    this.currentDataModel = new this.cObj();
  }

  /**
   * Sự kiện khi bấm nút lưu
   * @param saveType kiểu action thêm | Sửa | Xóa
   */
  public async onSave_Click(saveType: SaveType): Promise<void> {}

  /**
   * sự kiện ấn nút trên lưới
   * @param event Kiểu sửa | xóa
   */
  public onRowComand_Click(event: any): void {}

  /**
   * Sự kiện khóa
   */
  public onLock_Click(): void {}
}
