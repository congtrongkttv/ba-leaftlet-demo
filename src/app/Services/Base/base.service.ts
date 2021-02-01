import { Injectable } from '@angular/core';
import { BaseEntity } from '../../entities/Base/BaseEntity';
import { Observable } from 'rxjs';
import { BaseFilter } from 'src/app/entities/Base/BaseFilter';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BaseService<TEntity, TFilter> {
  constructor(private httpClient: HttpClient) {}

  public getData(filter: TFilter): Observable<any> {
    return null;
  }

  public getDetail(id: any): Observable<any> {
    return null;
  }

  public add(entity: any): Observable<any> {
    return null;
  }
  public update(entity: any): Observable<any> {
    return null;
  }
  public delete(id: any): Observable<any> {
    return null;
  }
  public lock(id: any): boolean {
    return true;
  }

  public saveCustomColumn(): Observable<any> {
    return this.httpClient.post('url', {});
  }
}
