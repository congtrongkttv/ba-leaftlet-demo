import { BaseManager } from '../BLL/BaseManager/BaseManager';
import { BaseEntity } from '../entities/Base/BaseEntity';
import { BaseFilter } from '../entities/Base/BaseFilter';
import { GeneralBaseReport } from './general-base-report';
import { SaveType } from '../Enum/save-type.enum';
export class CRUDBase<
  TEntity extends BaseEntity,
  TManager extends BaseManager<TEntity, TFilter>,
  TFilter extends BaseFilter
> extends GeneralBaseReport<TEntity, TManager, TFilter> {
  /**
   * Qyền thêm mới
   */
  public permissionKeyNameAdd: number;

  /**
   * Quyền sửa
   */
  public permissionKeyNameUpdate: number;

  /**
   * Quyền xóa
   */
  public permissionKeyNameDelete: number;

  /**
   * Thêm mới hay sửa
   */
  public isNew: boolean;

  /**
   * ĐỐi tượng đang được làm việc
   */
  public currentDataModel: TEntity = new this.cObj();

  // Validate dữ liệu khi thêm mới hoặc cập nhật
  public validateDataBeChanged(): boolean {
    return true;
  }

  /**
   * Hàm lấy chi tiết
   */
  public getDetail(): TEntity {
    return null;
  }

  /**
   * Hàm themem ới
   * @param entity Đói tượng thêm mới
   */
  public async create(entity: TEntity): Promise<boolean> {
    if (this.validateDataBeChanged()) {
      return this.baseManager.addNew(entity);
    }
    return false;
  }

  /**
   * Hàm cập nhật
   * @param entity Đối tượng cần cập nhật
   */
  public async update(entity: TEntity): Promise<boolean> {
    if (this.validateDataBeChanged()) {
      return this.baseManager.update(entity);
    }
    return false;
  }

  /**
   * Hàm xóa
   * @param id Mã truyền vào để xóa
   */
  public async delete(id: any): Promise<boolean> {
    return this.baseManager.delete(id);
  }

  /**
   * Hàm KHóa
   */
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
