import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Driver,
  DriverEntity,
  ResponseResult,
} from '../../entities/Driver/Driver';
import { DateTime } from '../../Helper/DateTimeHelper';
import { DriverFilter } from '../../entities/Driver/DriverFilter';
import { Observable } from 'rxjs';
import { BaseService } from '../Base/base.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService extends BaseService {
  lstDriver: Driver[] = [];
  constructor(private http: HttpClient) {
    super();
    let i = 0;
    while (i < 100) {
      // tslint:disable-next-line: new-parens
      const driv = new Driver();
      driv.RowIndex = i + 1;
      driv.DriverID = i + 1;
      driv.FullName = 'Đinh CÔng Trọng' + driv.DriverID;
      driv.BirthDay = new DateTime(new Date()).toFormat('dd/MM/yyyy');
      driv.LiscenseDriver = 'ádashkdasjdkljasodjqwp';
      driv.LiscenseDay = new DateTime(new Date()).toFormat('dd/MM/yyyy');
      this.lstDriver.push(driv);
      i++;
    }
  }

  getData(filter: DriverFilter): Promise<any> {
    const loginParams = new HttpParams()
      .set('keyword', '')
      .set('page', (filter.pager.pageIndex + 1).toString());
    return this.http
      .post('https://10.1.11.107:8036/api/hrmEmp/list', loginParams)
      .toPromise();
  }

  getRowCount(filter: DriverFilter): Promise<any> {
    const loginParams = new HttpParams().set('keyword', filter.contentSearch);
    return this.http
      .post('https://10.1.11.107:8036/api/hrmEmp/count', loginParams)
      .toPromise();
  }

  AddNew(driver: DriverEntity): boolean {
    return true;
  }
}
