import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../Base/base.service';
import { BaseEntity } from '../../entities/Base/BaseEntity';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { DriverEntity } from '../../entities/Driver/Driver';
import { UserEntity } from '../../entities/Users/User';
import { UserFilter } from '../../entities/Users/UserFilter';
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<UserEntity, UserFilter> {
  constructor(private http: HttpClient) {
    super();
  }

  getData(filter: UserFilter): Observable<any> {
    const params = {
      keyword: filter.searchContent,
      pageIndex: filter.currentPager.pageIndex,
      pageSize: filter.currentPager.pageSize,
    };
    return this.http.post('https://10.1.11.107:8036/api/admUser/list', params);
  }

  getDataByCompanyID(filter: UserFilter): Observable<any> {
    const params = {
      keyword: filter.searchContent,
      pageIndex: filter.currentPager.pageIndex,
      pageSize: filter.currentPager.pageSize,
      compId: filter.companyID,
    };
    return this.http.post('https://10.1.11.107:8036/api/admUser/comp', params);
  }

  getRowCount(filter: UserFilter): Observable<any> {
    const loginParams = new HttpParams().set('keyword', filter.searchContent);
    return this.http.post(
      'https://10.1.11.107:8036/api/admUser/count',
      loginParams
    );
  }

  getSummaries(filter: UserFilter): Observable<any> {
    const loginParams = new HttpParams()
      .set('keyword', filter.searchContent)
      .set('listProps', filter.columnsSummary);
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/summary',
      loginParams
    );
  }

  add(user: UserEntity): Observable<any> {
    return this.http.post(
      'https://10.1.11.107:8036/api/hrmEmp/create',
      JSON.stringify(user),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  update(driver: UserEntity): Observable<any> {
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