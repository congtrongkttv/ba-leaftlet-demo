import { CurrentData } from 'src/app/Page/tracking/tracking.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressModel } from 'src/app/entities/AddressModel';
import { APIResponseModel } from 'src/app/entities/Vehicle';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  token: string;
  constructor(private http: HttpClient) {}
  getAddress(
    lat: number,
    lng: number,
    useLandmark: boolean = false,
    companyID: number = 0
  ): Observable<any> {
    const url =
      'http://192.168.1.48:8000/api/v1/addresses' +
      '/' +
      lat +
      '/' +
      lng +
      '/' +
      useLandmark +
      '/' +
      companyID;

    return this.http
      .get<any>(url, {
        headers: {
          Authorization: `Bearer ${CurrentData.accessToken}`,
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
        },
      })
      .pipe();
  }

  getListAddress(listLatLng: AddressModel[]): Observable<any> {
    const url = 'http://192.168.1.48:8000/api/v1/addresses';
    return this.http
      .post<any>(
        url,
        {
          use_landmark_name: true,
          coordinates: listLatLng,
          company_id: 0,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe();
  }
}
