import { Injectable } from '@angular/core';
import { BaseEntity } from '../../entities/Base/BaseEntity';
import { Observable } from 'rxjs';
import { BaseFilter } from 'src/app/entities/Base/BaseFilter';
import { HttpClient } from '@angular/common/http';
import { ExportExcelOption } from 'src/app/Helper/export-option';
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

  public saveCustomColumn(data: any): Observable<any> {
    return this.httpClient.post(
      'https://10.1.11.107:8036/api/userReport/update',
      data
    );
  }
  public getColumnsGridCustom(data: any): Observable<any> {
    return this.httpClient.post(
      'https://10.1.11.107:8036/api/userReport/get',
      data
    );
  }

  public exportExcelFromServer(option: ExportExcelOption): Observable<any> {
    return null;
  }
}
