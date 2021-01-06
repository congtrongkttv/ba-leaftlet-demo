import * as L from 'leaflet';
import { Mapbase } from '../../Common/Mapbase';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ComponentRef,
} from '@angular/core';
import { OnlineServiceService } from '../../Services/online/online-service.service';
import { LeftpanelComponent } from '../../leftpanel/leftpanel.component';
import { Vehicle, APIResponseModel } from '../../entities/Vehicle';
import { VehicleDetail } from '../../entities/VehicleDetail';
import { BaMarker } from '../../Common/LeafletControl/BaMarker';
import { SignalRService } from '../../Services/SignalR/signal-r.service';
import { Subscription } from 'rxjs';
import { ObservationService } from '../../Services/ObservationService/observation.service';
import { AddressService } from '../../Services/Address/address.service';
import { AddressModel } from 'src/app/entities/AddressModel';
import { VehicleOnline } from '../../entities/VehicleOnline';
import { DatetimePipe } from '../../pipe/datetime.pipe';
import { DirectionService } from '../../Services/Direction/direction.service';
import { DateTime } from '../../Helper/DateTimeHelper';
import { VehiclePopupComponent } from '../Modal/vehicle-popup/vehicle-popup.component';
import { LatLngExpression } from 'leaflet';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent
  extends Mapbase
  implements OnInit, AfterViewInit {
  constructor(
    private onlineService: OnlineServiceService,
    private signalR: SignalRService,
    private obs: ObservationService,
    private address: AddressService,
    private direction: DirectionService,
    private injector: Injector,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver
  ) {
    super();
  }
  subscriptions = new Subscription();
  datetime = new DatetimePipe();
  public ListVehicles: Vehicle[] = [];
  public ListMarker: BaMarker[] = [];
  public CurrentMarker: BaMarker;
  public PreviosMarker: BaMarker;
  public MarkerGroup: L.FeatureGroup;
  public IsUseClusterMarker = false;
  private component = VehiclePopupComponent;
  private compRef: ComponentRef<VehiclePopupComponent>;
  @ViewChild(LeftpanelComponent) leftPanel: LeftpanelComponent;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.initMap('map', {});
    if (this.compRef) {
      this.compRef.destroy();
    }
    const compFactory = this.resolver.resolveComponentFactory(this.component);
    this.compRef = compFactory.create(this.injector);
    this.map.addEventListener('zoomend', () => {
      // Nếu sử dụng cluster
      // Nếu xe đang theo dõi không mở popup thì không cho vào cluster và ngược lại
      if (
        this.IsUseClusterMarker &&
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
    this.getListVehicle();
  }

  OnClickCustomControl(): void {
    console.log('click custom control');
  }

  OnRefresh(): void {
    this.getListVehicle();
  }

  OnChangeVehicleState(vehicleStateID): void {
    if (vehicleStateID === '0') {
      this.leftPanel.sortListVehicle();
    } else if (vehicleStateID === '1') {
      this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity < 5
      );
    } else if (vehicleStateID === '2') {
      this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 5 &&
          x.velocity < 60
      );
    } else if (vehicleStateID === '3') {
      this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 60
      );
    } else if (vehicleStateID === '4') {
      this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 <= new Date().getTime()
      );
    }

    this.reDrawMarker(this.leftPanel.ListVehiclesTemp, vehicleStateID);
  }

  async updateAddressForListVehicles() {
    const listLatLng: AddressModel[] = this.leftPanel.listVehicles.map(
      (vehicle) => {
        return { lat: vehicle.latitude, lng: vehicle.longitude, addr: '' };
      }
    );

    await this.address
      .getListAddress(listLatLng)
      .toPromise()
      .then((res: APIResponseModel) => {
        if (res.statusCode === 200 && res.responseCode === 0) {
          (res.data as string[]).forEach((address, index) => {
            this.leftPanel.listVehicles[index].address = address;
          });
        }
      });
  }

  initVehicle(vehicles: any): void {
    const that = this;
    this.leftPanel.listVehicles = [];
    this.leftPanel.ListVehiclesTemp = [];
    this.ListMarker = [];
    this.ListVehicles = [];
    for (const v of vehicles.data) {
      const vehicle = new Vehicle(v);
      vehicle.iconPath = this.updateIconPathByVelocity(vehicle);
      this.ListVehicles.push(vehicle);
      this.leftPanel.listVehicles.push(vehicle);

      const marker = this.createMarker(vehicle, '', false, true);
      marker.id = vehicle.vehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.vehicleId);
        this.leftPanel.CurrentVehicleIDSelected = vehicle.vehicleId;
        this.CurrentMarker = marker;
      });
      if (this.IsUseClusterMarker) {
        this.markersCluster.addLayer(marker);
      } else {
        this.map.addLayer(marker);
      }
      this.ListMarker.push(marker);
    }
    if (this.IsUseClusterMarker) {
      this.map.addLayer(this.markersCluster);
    } else {
      this.map.removeLayer(this.markersCluster);
    }
    this.leftPanel.ListVehiclesTemp = this.leftPanel.listVehicles;
    // Call SignalR
    const vehicleIDs = this.leftPanel.listVehicles.map(
      ({ vehicleId }) => vehicleId
    );
    this.callSignalR(vehicleIDs.join(','));
    // this.updateAddressForListVehicles();
  }

  private callSignalR(vehicleIds: string): void {
    this.signalR
      .startConnection(CurrentData.UserID, '')
      .then(() => {
        this.signalR.joinGroup(vehicleIds);
        // Lắng nghe dữ liệu từ SignalR
        this.subscriptions.add(
          this.obs.leftPanelSubject.subscribe((data) => {
            if (data !== null && data !== undefined) {
              const vehicleOn = new VehicleOnline(JSON.parse(data));
              this.updateListVehicleOnline(vehicleOn);
              this.leftPanel.sortListVehicle();
            }
          })
        );
      })
      .catch((error) => {
        // this.alertSrv.error("ErrorConnectSignalR", "LOI");
      });
  }
  public async updateListVehicleOnline(newVehicle: VehicleOnline) {
    // update danh sách xe bên trái
    let oldLat: number;
    let oldLng: number;
    const vehicle = this.leftPanel.listVehicles.find(
      (m) => m.vehicleId === newVehicle.vehicleId
    );

    if (vehicle) {
      oldLat = vehicle.latitude;
      oldLng = vehicle.longitude;
      const arrProps = [
        'latitude',
        'longitude',
        'state',
        'velocity',
        'gpsTime',
        'vehicleTime',
        'dataExt',
        'stopTime',
        'lastTimeMove',
        'velocityMechanical',
      ];
      const voProp = Object.getOwnPropertyNames(newVehicle);
      for (const item of voProp) {
        if (arrProps.indexOf(item) >= 0) {
          vehicle[item] = newVehicle[item];
        }
      }
      vehicle.iconPath = this.updateIconPathByVelocity(vehicle);
      vehicle.direction = this.direction.getDirectionBetween2Point(
        oldLat,
        oldLng,
        newVehicle.latitude,
        newVehicle.longitude
      );
    }

    // update marker
    const marker = this.ListMarker.filter(
      (x) => x.id === newVehicle.vehicleId
    )[0];
    if (marker) {
      // Nếu là xe đang theo dõi thì cập nhật thông tin popup
      if (marker === this.CurrentMarker) {
        if (this.CurrentMarker.getPopup().isPopupOpen) {
          const address = this.address
            .getAddress(vehicle.latitude, vehicle.longitude)
            .subscribe((x) => {
              this.compRef.instance.Address = x.data;
            });
          const vehicleDetail = new VehicleDetail();
          vehicleDetail.vehiclePlate = newVehicle.vehiclePlate;
          vehicleDetail.velocityGPS = newVehicle.velocity;
          vehicleDetail.velocityMechanical = newVehicle.velocityMechanical;
          vehicleDetail.gpsTime = newVehicle.gpsTime;
          vehicleDetail.vehicleTime = newVehicle.vehicleTime;
          vehicleDetail.stopTime = newVehicle.stopTime;
          vehicleDetail.vehiceState = newVehicle.state;
          vehicleDetail.latitude = newVehicle.latitude;
          vehicleDetail.longitude = newVehicle.longitude;
          const popupContent = this.createPopup(vehicleDetail);
          marker.setPopupContent(popupContent);
          this.map.panTo(
            new L.LatLng(newVehicle.latitude, newVehicle.longitude)
          );
        }
      } else {
        marker.setLatLng(
          new L.LatLng(newVehicle.latitude, newVehicle.longitude)
        );
      }
      this.updateMarker(marker, vehicle);
    }
  }

  async showDetailVehicle(vehicle: VehicleDetail) {
    const address = this.address
      .getAddress(vehicle.latitude, vehicle.longitude)
      .subscribe((x) => {
        this.compRef.instance.Address = x.data;
        vehicle.address = x.data;
      });
    const currentMarker = this.ListMarker.filter(
      (x) => x.id === vehicle.vehicleID
    )[0];
    if (currentMarker !== undefined && currentMarker != null) {
      this.CurrentMarker = currentMarker;
      // Nội dung content khi click vào marker
      const contenPopup = this.createPopup(vehicle);
      this.CurrentMarker.bindPopup(contenPopup);
      this.CurrentMarker.openPopup();
      const latlng = this.CurrentMarker.getLatLng();
      this.panTo(latlng, this.map.getZoom());
      // scroll đến dòng trên leftpanel
      const indexRow = this.leftPanel.ListVehiclesTemp.findIndex(
        (x) => x.vehicleId === vehicle.vehicleID
      );
      this.leftPanel.virtualScroller.scrollToIndex(indexRow - 2);

      // fil giá trị vào text box tìm kiếm xe
      this.leftPanel.autocompleteVehicle.writeValue(vehicle.vehiclePlate);
    }
  }

  reDrawMarker(data: Vehicle[], vehicleStateID: string): void {
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
      vehicle.iconPath = this.updateIconPathByVelocity(vehicle);
      const marker = this.createMarker(vehicle, '', false, true);
      marker.id = vehicle.vehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.vehicleId);
        this.leftPanel.CurrentVehicleIDSelected = vehicle.vehicleId;
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

  updateIconPathByVelocity(vehicle: Vehicle): string {
    const vehicleTime = new Date(vehicle.vehicleTime);
    if (vehicleTime.getTime() + 3600000 <= new Date().getTime()) {
      return 'assets/icons/GpsLost.png';
    } else if (vehicle.velocity < 5) {
      return 'assets/icons/Gray0.png';
    } else if (vehicle.velocity >= 5 && vehicle.velocity < 60) {
      return 'assets/icons/Blue0.png';
    } else if (vehicle.velocity >= 60) {
      return 'assets/icons/Red0.png';
    } else {
      return 'assets/icons/Blue0.png';
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
    // tslint:disable-next-line: no-bitwise
    const stateMachine = (vehicle.vehiceState & 8) === 0 ? 'Bật' : 'Tắt';
    const stateDoor = (vehicle.vehiceState & 16) === 0 ? 'Đóng' : 'Mở';

    this.compRef.instance.VehiclePlate = vehicle.vehiclePlate;
    this.compRef.instance.VehicleTime = new DateTime(
      vehicle.vehicleTime
    ).toFormat();
    this.compRef.instance.Location =
      vehicle.latitude + ' - ' + vehicle.longitude;
    this.compRef.instance.Address = vehicle.address;
    this.compRef.instance.Velocity = vehicle.velocityGPS.toString();
    this.compRef.instance.DoorState = stateDoor;
    this.compRef.instance.MachineState = stateMachine;

    this.appRef.attachView(this.compRef.hostView);
    this.compRef.onDestroy(() => {
      this.appRef.detachView(this.compRef.hostView);
    });

    return this.compRef.location.nativeElement;
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
      (x) => x.vehicleId === vehicleID
    )[0];
    const plate = currentVehicles.vehiclePlate;
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
  public static accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NDZhYmY0ZmZiM2U0ZDA0OWQ3ZTAxZWU0OTEwOTNjNSIsInVuaXF1ZV9uYW1lIjpbIjg0NmFiZjRmZmIzZTRkMDQ5ZDdlMDFlZTQ5MTA5M2M1IiwiQmFHUFN2MyJdLCJuYW1lIjoiODQ2YWJmNGZmYjNlNGQwNDlkN2UwMWVlNDkxMDkzYzUiLCJqdGkiOlsiMWE3YTJkZjYtODcyNC00YzIzLTkxOTItMjI4YmU0MzljZDFlIiwiODQ2YWJmNGYtZmIzZS00ZDA0LTlkN2UtMDFlZTQ5MTA5M2M1Il0sImlhdCI6IjE2MDk4MDgxMDcyODEiLCJjaXAiOiI6OmZmZmY6MTcyLjE5LjAuNCIsInZlciI6IjMiLCJyb2xlIjpbIjEiLCIzIiwiNCIsIjUiLCI2IiwiOSIsIjExIiwiMTIiLCIxMyIsIjE0IiwiMTUiLCIxNiIsIjE3IiwiMjEiLCIyMiIsIjIzIiwiMjQiLCIyNSIsIjI2IiwiMjciLCIzMSIsIjMyIiwiMzMiLCIzNCIsIjUxIiwiNjEiLCI2MiIsIjYzIiwiNjUiLCI2NyIsIjcxIiwiNzIiLCI3MyIsIjc0IiwiNzUiLCI3NiIsIjc3IiwiNzgiLCI3OSIsIjgwIiwiODEiLCI4MiIsIjgzIiwiODQiLCI4NiIsIjg3IiwiOTEiLCI5MiIsIjk2IiwiOTciLCI5OCIsIjEwMSIsIjEwMiIsIjEyNiIsIjEzMCIsIjEzMSIsIjEzNiIsIjEzNyIsIjE1MSIsIjE1MiIsIjE3MSIsIjE3MiIsIjE3MyIsIjE5MSIsIjE5MiIsIjE5MyIsIjE5NCIsIjE5NSIsIjIwMSIsIjIwMiIsIjIwMyIsIjIwNCIsIjIwNSIsIjIxMSIsIjIxMiIsIjIxMyIsIjIxNCIsIjIxNSIsIjI1MyIsIjI1NCIsIjI1NSIsIjQ2NyIsIjQ2OCIsIjQ2OSIsIjQ3NSIsIjQ3NiIsIjQ3NyIsIjQ3OCIsIjQ4MSIsIjQ4MiIsIjQ4MyIsIjQ4NCIsIjUwNiIsIjUwNyIsIjUwOCIsIjUwOSIsIjUxMCIsIjUyNiIsIjUzMSIsIjU2OSIsIjU3MCIsIjU3MSIsIjYwNCIsIjYwNSIsIjYwNiIsIjYwNyIsIjYxMyIsIjYxNCIsIjYxNSIsIjYxNiIsIjY1MSIsIjY1MiIsIjY1MyIsIjY1NCIsIjY1NSIsIjY1NiIsIjgxOCIsIjgxOSIsIjgyMCIsIjg0OSIsIjg1MCIsIjg1MSIsIjg1MiIsIjg1MyIsIjg1NCIsIjg1NSIsIjg1NiIsIjg1NyIsIjg1OCIsIjg1OSIsIjg2MCIsIjg2MSIsIjg2MiIsIjg2MyIsIjg2NCIsIjg2NSIsIjg2NiIsIjg2NyIsIjg2OCIsIjg2OSIsIjk3MCIsIjk5OCIsIjEwMDIiLCIxMDYzIiwiMTEyMyIsIjExNTgiLCIxMjEwIiwiMTIxMSIsIjEzNDMiLCIxMzQ0IiwiMTM0NyIsIjEzNDgiLCIxMzU2IiwiMjAwOCIsIjIwMDkiLCIyMDEwIiwiMjAxMSIsIjIwMTIiLCIyMDEzIiwiMjAxNCIsIjIwMTUiLCIyMDE2IiwiMjAxNyIsIjIwMTgiLCIyMDE5IiwiMjAyMCIsIjAiXSwibmFtZWlkIjoiODQ2YWJmNGYtZmIzZS00ZDA0LTlkN2UtMDFlZTQ5MTA5M2M1IiwiVXNlck5hbWUiOiJyYWJiaXRuIiwiRnVsbE5hbWUiOiJUaOG7jyBOIiwiQXZhdGFyVXJsIjoiIiwibmJmIjoxNjA5ODA4MTA3LCJleHAiOjE2MDk4MjI1MDcsImlzcyI6ImlkZW50aXR5LXNlcnZpY2UifQ.h8Hr9ldUGLvGBrF1Zubn9RIJD1YvCecC-GB7VCgiYE8';
}
