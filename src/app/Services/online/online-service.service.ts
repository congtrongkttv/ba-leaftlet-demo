import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VehicleDetail } from '../../entities/VehicleDetail';
import { APIResponseModel, Vehicle } from 'src/app/entities/Vehicle';
import { CurrentData } from 'src/app/tracking/tracking.component';

@Injectable({
  providedIn: 'root',
})
export class OnlineServiceService {
  constructor(private http: HttpClient) {}
  getDetail(
    companyID: number,
    xnCode: number,
    vehicleplate: string
  ): Observable<APIResponseModel> {
    const url =
      'http://192.168.1.48:8000/api/v1/vehicleonline/' +
      companyID +
      '/' +
      xnCode +
      '/' +
      vehicleplate;
    return this.http.get<APIResponseModel>(url);
  }

  initListVehicles(
    userid: string,
    companyid: number,
    xncode: number,
    usertype: number,
    companytype: number
  ): Observable<APIResponseModel> {
    const url =
      'http://192.168.1.48:8000/api/v1/vehicleonline/' +
      userid +
      '/' +
      companyid +
      '/' +
      xncode +
      '/' +
      usertype +
      '/' +
      companytype;
    return this.http.get<APIResponseModel>(url);
  }

  syncVehicles(
    userid: string,
    companyid: number,
    xncode: number,
    usertype: number,
    companytype: number
  ): Observable<APIResponseModel> {
    const url =
      'http://192.168.1.48:8000/api/v1/syncvehicleonline/' +
      userid +
      '/' +
      companyid +
      '/' +
      xncode +
      '/' +
      usertype +
      '/' +
      companytype;
    return this.http.get<APIResponseModel>(url);
  }
}
