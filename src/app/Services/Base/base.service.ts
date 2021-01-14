import { Injectable } from '@angular/core';
import { BaseEntity } from '../../entities/Base/BaseEntity';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor() {}

  getData(filter: any): Promise<any[]> {
    return null;
  }

  getDetail(id: any): Promise<any[]> {
    return null;
  }

  add(entity: any): boolean {
    return true;
  }
  update(entity: any): boolean {
    return true;
  }
  delete(id: any): boolean {
    return true;
  }
}
