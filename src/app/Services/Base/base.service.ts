import { Injectable } from '@angular/core';
import { BaseEntity } from '../../entities/Base/BaseEntity';
import { Observable } from 'rxjs';
import { BaseFilter } from 'src/app/entities/Base/BaseFilter';
@Injectable({
  providedIn: 'root',
})
export class BaseService<TEntity, TFilter> {
  constructor() {}

  getData(filter: TFilter): Observable<any> {
    return null;
  }

  getDetail(id: any): Observable<any> {
    return null;
  }

  add(entity: any): Observable<any> {
    return null;
  }
  update(entity: any): Observable<any> {
    return null;
  }
  delete(id: any): Observable<any> {
    return null;
  }
  lock(id: any): boolean {
    return true;
  }
}
