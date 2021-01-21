import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Pager } from '../../Core/pager';
import { BaseService } from '../../Services/Base/base.service';
import { BaseFilter } from '../../entities/Base/BaseFilter';
import { AppInjector } from '../../app.module';
import { DriverService } from '../../Services/driver/driver.service';
import { SummaryItems } from '../../entities/summary-items';

/**
 * Trang quản lý để xử lý logic, truy xuất dữ liệu
 * @template TEntity ĐỐi tượng trả về
 */
export class BaseManager<TEntity, TFilter extends BaseFilter> {
  constructor(protected bFilter: new () => TFilter) {}

  // Thông tin pagerAll: Sử dụng khi get Rowcount, lấy tất cả dữ liệu
  public pagerAll: Pager = new Pager(387590 * 1000, 0);

  // BaseService
  public baseService: any;

  // baseFilter: bộ lọc dữ liệu - điều kiện tìm kiếm
  public baseFilter: TFilter = new this.bFilter();

  // ds cột cần tính tổng
  public columnsSummaryItems: string[] = [];

  // ds cột bắt buộc của lưới dữ liệu
  public columnsGridRequired: any[];

  // ds cột cho phép ẩn hiện của lưới dữ liệu
  public columnsGridCustom: {
    title: string;
    feild: string;
    checked: boolean;
  }[];

  // ds cột không cho phép hiện lên khi xuất báo cáo
  public columnsGridExclude: any[];

  /**
   * Lấy dữ liệu
   */
  public async getDataReport(): Promise<{ data: TEntity[]; total: 0 }> {
    return null;
  }

  /**
   * Lấy tất cả dữ liệu
   */
  public async getAllDataReport(): Promise<{ data: TEntity[]; total: 0 }> {
    return null;
  }

  /**
   * Lấy số dòng dữ liệu để phân trang custom
   */
  public async getRowCountReport(): Promise<number> {
    return null;
  }

  /**
   * Lấy số dòng dữ liệu để phân trang custom
   */
  public async getSummaryReport(): Promise<SummaryItems> {
    return null;
  }

  /**
   * Lấy ra cấu hình ẩn hiện cột
   */
  public getColumnsGridCustom(): {
    title: string;
    feild: string;
    checked: boolean;
  }[] {
    return null;
  }

  /**
   * Lưu cấu hình ẩn hiện cột
   */
  public saveCustomColumns(): void {}

  public async addNew(entity: TEntity): Promise<boolean> {
    return null;
  }

  public async update(entity: TEntity): Promise<boolean> {
    return null;
  }

  public async delete(id: any): Promise<boolean> {
    return null;
  }
}
