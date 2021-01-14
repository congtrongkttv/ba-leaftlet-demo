import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Driver, DriverEntity } from '../../entities/Driver/Driver';
import { DateTime } from '../../Helper/DateTimeHelper';
import { DriverFilter } from '../../entities/Driver/DriverFilter';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  lstDriver: Driver[] = [];
  constructor(private http: HttpClient) {
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

  getData(filter: DriverFilter): Driver[] {
    let data = this.lstDriver;
    if (filter.contentSearch !== '' && filter.contentSearch !== undefined) {
      data = this.lstDriver.filter(
        (x) =>
          x.FullName.toLowerCase().indexOf(
            filter.contentSearch.toLowerCase()
          ) >= 0 ||
          x.LiscenseDriver.toLowerCase().indexOf(
            filter.contentSearch.toLowerCase()
          ) >= 0
      );
    }
    let i = 0;
    data.forEach((dr) => {
      i++;
      dr.RowIndex = i;
    });
    data = data.filter(
      (x) =>
        x.RowIndex >= filter.pager.startRow && x.RowIndex <= filter.pager.endRow
    );
    return data;
  }

  getAllDataApi(pageIndex: number): Promise<DriverEntity[]> {
    const loginParams = new HttpParams()
      .set('keyword', '')
      .set('page', (pageIndex + 1).toString());
    return this.http
      .post('https://10.1.11.107:8036/api/hrmEmp/list', loginParams)
      .toPromise()
      .then((x: any) => {
        return x.data;
      });
  }

  AddNew(driver: Driver): boolean {
    driver.RowIndex = this.lstDriver.length + 1;
    driver.DriverID = this.lstDriver.length + 1;
    driver.BirthDay = new DateTime(new Date()).toFormat('dd/MM/yyyy');
    driver.LiscenseDay = new DateTime(new Date()).toFormat('dd/MM/yyyy');
    this.lstDriver.push(driver);
    return true;
  }
}
