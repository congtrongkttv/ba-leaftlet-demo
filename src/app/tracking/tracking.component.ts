import * as L from 'leaflet';
import { VehicleEntity } from './../entities/VehicleEntity';
import { Mapbase } from './../Common/Mapbase';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { OnlineServiceService } from '../Services/online/online-service.service';
import { LeftpanelComponent } from '../leftpanel/leftpanel.component';
import { Vehicle, APIResponseModel } from '../entities/Vehicle';
import { VehicleDetail } from '../entities/VehicleDetail';
import { BaMarker } from '../Common/BaControlLeaflet';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent
  extends Mapbase
  implements OnInit, AfterViewInit {
  constructor(private onlineService: OnlineServiceService) {
    super();
  }
  public ListVehicles: Vehicle[] = [];
  public ListMarker: BaMarker[] = [];
  public CurrentMarker: BaMarker;
  public PreviosMarker: BaMarker;
  public MarkerGroup: L.FeatureGroup;
  @ViewChild(LeftpanelComponent) leftPanel: LeftpanelComponent;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.initMap('map', {});
    this.map.addEventListener('zoomend', () => {
      // Nếu sử dụng cluster
      // Nếu xe đang theo dõi không mở popup thì không cho vào cluster và ngược lại
      if (
        this.leftPanel.IsUseCluster &&
        this.CurrentMarker !== undefined &&
        this.CurrentMarker !== null
      ) {
        const popup = this.CurrentMarker.getPopup();
        if (!popup.isOpen()) {
          if (!this.markersCluster.hasLayer(this.CurrentMarker)) {
            this.map.removeLayer(this.CurrentMarker);
            this.markersCluster.addLayer(this.CurrentMarker);
          }
        }
      }
    });
    this.initClusterOptions();
    this.markersCluster = L.markerClusterGroup(this.markersClusterOptions);
    this.MarkerGroup = L.featureGroup();
    this.getListVehicle();
  }

  OnClickCustomControl(): void {
    console.log('click custom control');
  }

  OnRefresh(): void {
    this.getListVehicle();
  }

  OnChangeVehicleState(vehicleStateID): void {
    switch (vehicleStateID) {
      case '0':
        this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles;
        break;
      case '1':
        this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
          (x) => x.Velocity < 5
        );
        break;
      case '2':
        this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
          (x) => x.Velocity >= 5 && x.Velocity < 60
        );
        break;
      case '3':
        this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
          (x) => x.Velocity >= 60
        );
        break;
      case '4':
        this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
          (x) => new Date(x.GPSTime) < new Date()
        );
        break;
    }
    this.reDrawMarker(this.leftPanel.ListVehiclesTemp);
  }
  initVehicle(vehicles: any): void {
    const that = this;
    this.leftPanel.listVehicles = [];
    this.leftPanel.ListVehiclesTemp = [];
    this.ListMarker = [];
    this.ListVehicles = [];
    for (const v of vehicles.data) {
      const vehicle = new Vehicle(v);
      this.ListVehicles.push(vehicle);
      this.leftPanel.listVehicles.push(vehicle);
      const vehiclesEntity = new VehicleEntity();
      vehiclesEntity.VehicleID = vehicle.VehicleId;
      vehiclesEntity.VehiclePlate = vehicle.VehiclePlate;
      vehiclesEntity.Latitude = vehicle.Latitude;
      vehiclesEntity.Longitude = vehicle.Longitude;
      vehiclesEntity.IconPath = 'assets/icons/Blue0.png';
      // Nội dung content khi click vào marker
      let contenPopup =
        '<table class="tbl-popup-marker"><tr><td>BKS</td><td>' +
        vehicle.VehiclePlate +
        '</td></tr>';
      contenPopup +=
        '<tr><td>Thời gian online</td><td>' +
        vehicle.VehicleTime +
        '</td></tr>';
      contenPopup +=
        '<tr><td>Tốc độ</td><td>' + vehicle.Velocity + ' km/h</td></tr>';
      contenPopup +=
        '<tr><td>Trạng thái</td><td>' + vehicle.State + '</td></tr>';
      contenPopup += '</table>';
      const marker = this.createMarker(
        vehiclesEntity,
        contenPopup,
        false,
        true
      );
      marker.id = vehicle.VehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.VehicleId);
        this.leftPanel.CurrentVehicleIDSelected = vehicle.VehicleId;
      });
      if (this.leftPanel.IsUseCluster) {
        this.markersCluster.addLayer(marker);
      } else {
        this.map.addLayer(marker);
      }
      this.ListMarker.push(marker);
    }
    if (this.leftPanel.IsUseCluster) {
      this.map.addLayer(this.markersCluster);
    } else {
      this.map.removeLayer(this.markersCluster);
    }
    this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles;
  }

  showDetailVehicle(vehicle: VehicleDetail): void {
    const currentMarker = this.ListMarker.filter(
      (x) => x.id === vehicle.vehicleID
    )[0];
    if (currentMarker !== undefined && currentMarker != null) {
      this.CurrentMarker = currentMarker;
      // Nội dung content khi click vào marker
      let contenPopup = this.createPopup(vehicle);

      contenPopup += '</table>';
      this.CurrentMarker.bindPopup(contenPopup);
      this.CurrentMarker.openPopup();
      const latlng = this.CurrentMarker.getLatLng();
      this.panTo(latlng, this.map.getZoom());
      const indexRow = this.leftPanel.ListVehiclesTemp.findIndex(
        (x) => x.VehicleId === vehicle.vehicleID
      );
      const virtualHeight = this.leftPanel.virtualScroller.childHeight;

      let position = indexRow * virtualHeight - 10;
      if (indexRow > this.leftPanel.ListVehiclesTemp.length - 19) {
        position += 300;
        this.leftPanel.virtualScroller.scrollToPosition(position);
      }
      if (
        indexRow > 19 &&
        indexRow < this.leftPanel.ListVehiclesTemp.length - 19
      ) {
        this.leftPanel.virtualScroller.scrollToPosition(position);
      }
    }
  }

  reDrawMarker(data: Vehicle[]): void {
    // Xóa marker khỏi bamnr đồ và cluster
    this.ListMarker.forEach((element) => {
      this.map.removeLayer(element);
      if (this.markersCluster.hasLayer(element)) {
        this.markersCluster.removeLayer(element);
      }
    });
    this.ListMarker = [];
    // Vẽ lại marker trên bản đồ
    for (const vehicle of data) {
      const vehiclesEntity = new VehicleEntity();
      vehiclesEntity.VehicleID = vehicle.VehicleId;
      vehiclesEntity.VehiclePlate = vehicle.VehiclePlate;
      vehiclesEntity.Latitude = vehicle.Latitude;
      vehiclesEntity.Longitude = vehicle.Longitude;
      vehiclesEntity.IconPath = 'assets/icons/Blue0.png';
      // Nội dung content khi click vào marker
      let contenPopup =
        '<table class="tbl-popup-marker"><tr><td>BKS</td><td>' +
        vehicle.VehiclePlate +
        '</td></tr>';
      contenPopup +=
        '<tr><td>Thời gian online</td><td>' +
        vehicle.VehicleTime +
        '</td></tr>';
      contenPopup +=
        '<tr><td>Tốc độ</td><td>' + vehicle.Velocity + ' km/h</td></tr>';
      contenPopup +=
        '<tr><td>Trạng thái</td><td>' + vehicle.State + '</td></tr>';
      contenPopup += '</table>';
      const marker = this.createMarker(
        vehiclesEntity,
        contenPopup,
        false,
        true
      );
      marker.id = vehicle.VehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.VehicleId);
        this.leftPanel.CurrentVehicleIDSelected = vehicle.VehicleId;
      });
      if (this.leftPanel.IsUseCluster) {
        this.markersCluster.addLayer(marker);
      } else {
        this.map.addLayer(marker);
      }
      this.ListMarker.push(marker);
    }
    if (this.leftPanel.IsUseCluster) {
      this.map.addLayer(this.markersCluster);
    } else {
      this.map.removeLayer(this.markersCluster);
    }
  }

  clearAllData(): void {
    // Xóa dữ liệu bind lefpanel
    this.leftPanel.ListVehiclesTemp = [];
    this.leftPanel.listVehicles = [];
    // Xóa marker khỏi bamnr đồ và cluster
    this.ListMarker.forEach((element) => {
      this.map.removeLayer(element);
      if (this.markersCluster.hasLayer(element)) {
        this.markersCluster.removeLayer(element);
      }
    });
    this.ListMarker = [];
    // xóa selected ở leftpanel
    this.leftPanel.CurrentVehicleIDSelected = -1;
  }
  // Tạo popup hiện trạng xe
  createPopup(vehicle: VehicleDetail): any {
    let contenPopup =
      `<table class="tbl-popup-marker">
        <tr class='row-detail-header'><td colspan='2'>THÔNG TIN PHƯƠNG TIỆN</td></tr>
        <tr><td class='row-detail-body-col1'>BKS</td><td class='row-detail-body-col2 row-detail-body-plate'>` +
      vehicle.vehiclePlate +
      `</td></tr>`;
    contenPopup +=
      `<tr><td class='row-detail-body-col1'>Thời gian online</td><td class='row-detail-body-col2'>` +
      vehicle.vehicleTime +
      `</td></tr>`;
    contenPopup +=
      `<tr><td class='row-detail-body-col1'>Tốc độ</td>
        <td class='row-detail-body-col2'>` +
      vehicle.velocityGPS +
      ` km/h</td></tr>`;
    contenPopup +=
      `<tr><td class='row-detail-body-col1'>Trạng thái</td>
        <td class='row-detail-body-col2'>` +
      vehicle.vehiceState +
      `</td></tr>`;
    contenPopup +=
      `<tr><td class='row-detail-body-col1'>Toạ độ</td>
        <td class='row-detail-body-col2'>` +
      vehicle.latitude +
      ' - ' +
      vehicle.longitude +
      `</td></tr>`;
    contenPopup += '</table>';
    return contenPopup;
  }

  // Khởi tạo danh sách xe
  getListVehicle(): void {
    this.clearAllData();
    this.onlineService
      .initListVehicles(
        CurrentData.UserID,
        CurrentData.CompanyID,
        CurrentData.XNCode,
        CurrentData.UserType,
        CurrentData.CompanyType
      )
      .pipe()
      .subscribe((vehicles: APIResponseModel) => {
        if (vehicles && vehicles.statusCode === 200) {
          this.initVehicle(vehicles);
        }
      });
  }

  syncVehicles(): void {
    setInterval(() => {
      this.onlineService
        .syncVehicles(
          CurrentData.UserID,
          CurrentData.CompanyID,
          CurrentData.XNCode,
          CurrentData.UserType,
          CurrentData.CompanyType
        )
        .pipe()
        .subscribe((vehicles: APIResponseModel) => {
          if (vehicles && vehicles.statusCode === 200) {
            // this.initVehicle(vehicles);
          }
        });
    }, 5 * 1000);
  }
  // Sự kiện chọn xe (click marker hoặc leftpanel)
  onSelectVehicle(vehicleID: any): void {
    const currentVehicles = this.ListVehicles.filter(
      (x) => x.VehicleId === vehicleID
    )[0];
    const plate = currentVehicles.VehiclePlate;
    const companyID = CurrentData.CompanyID;
    const xnCode = CurrentData.XNCode;
    this.onlineService
      .getDetail(companyID, xnCode, plate)
      .subscribe((response: APIResponseModel) => {
        if (response && response.statusCode === 200) {
          this.showDetailVehicle(response.data);
        }
      });
  }
}

export class CurrentData {
  public static CompanyID = 15076;
  public static UserID = '846abf4f-fb3e-4d04-9d7e-01ee491093c5';
  public static XNCode = 7643;
  public static UserType = 1;
  public static CompanyType = 3;
}
