import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../Base/base.service';
import { BaseEntity } from '../../entities/Base/BaseEntity';
import { DateTime } from '../../Helper/DateTimeHelper';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { BaseFilter } from '../../entities/Base/BaseFilter';
import { DriverEntity } from '../../entities/Driver/Driver';
@Injectable({
  providedIn: 'root',
})
export class DriverService extends BaseService<DriverEntity, DriverFilter> {
  constructor(private http: HttpClient) {
    super();
  }

  getData(filter: DriverFilter): Observable<any> {
    const loginParams = new HttpParams()
      .set('keyword', filter.searchContent)
      .set('page', (filter.pager.pageIndex + 1).toString());
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/list',
      loginParams
    );
  }

  getRowCount(filter: DriverFilter): Observable<any> {
    const loginParams = new HttpParams().set('keyword', filter.searchContent);
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/count',
      loginParams
    );
  }

  add(driver: DriverEntity): Observable<any> {
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/create',
      JSON.stringify(driver),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  update(driver: DriverEntity): Observable<any> {
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/update',
      JSON.stringify(driver),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  delete(id: any): Observable<any> {
    const loginParams = new HttpParams().set('id', id);
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/delete',
      loginParams
    );
  }
}
