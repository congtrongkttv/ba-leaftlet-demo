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
  private subSync = new Subscription();
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
    // this.map.addEventListener('click', () => {
    //   this.leftPanel.CurrentVehicle = new Vehicle();
    //   this.CurrentMarker = null;
    // });
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
    this.reDrawMarker(this.leftPanel.ListVehiclesTemp, vehicleStateID);
  }

  async updateAddressForListVehicles(): Promise<void> {
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
      vehicle.iconPath = this.leftPanel.updateIconPathByVelocity(vehicle);
      this.ListVehicles.push(vehicle);
      this.leftPanel.listVehicles.push(vehicle);

      const marker = this.createMarker(vehicle, '', false, true);
      marker.id = vehicle.vehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.vehicleId);
        this.leftPanel.CurrentVehicle = vehicle;
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
    // Nếu SignalR lỗi thì gọi hàm sync
    this.syncVehicles();
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
              this.leftPanel.updateListVehicleOnline(vehicleOn);
              this.updateListMarker(vehicleOn);
              this.leftPanel.sortListVehicle();
            }
          })
        );
      })
      .catch((error) => {
        // this.alertSrv.error("ErrorConnectSignalR", "LOI");
      });
  }

  syncVehicles(): void {
    setInterval(() => {
      if (this.signalR.hubConnection.state !== 1) {
        this.subSync = this.onlineService
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
      } else {
        this.subSync.unsubscribe();
      }
    }, 5 * 1000);
  }

  getStateVehicleByVelocity(newVehicle: VehicleOnline): string {
    if (newVehicle.velocity < 5) {
      return '1';
    } else if (newVehicle.velocity >= 5 && newVehicle.velocity < 60) {
      return '2';
    } else if (newVehicle.velocity >= 60) {
      return '3';
    } else {
      return '0';
    }
  }

  public async updateListMarker(newVehicle: VehicleOnline): Promise<void> {
    // update marker
    const vehicle = this.leftPanel.listVehicles.find(
      (m) => m.vehicleId === newVehicle.vehicleId
    );

    const marker = this.ListMarker.filter(
      (x) => x.id === newVehicle.vehicleId
    )[0];
    if (marker !== undefined) {
      // Nếu là xe đang theo dõi thì cập nhật thông tin popup
      if (marker.id === this.CurrentMarker?.id) {
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
        // Nếu xe thuộc list trạng thái đang xem
        if (
          this.getStateVehicleByVelocity(newVehicle) ===
          this.leftPanel.CurrentVehicleState4Search
        ) {
          // Nếu xe đang hiện trên bản đồ -> update vị trí
          // Nếu xe không có trên bản đồ -> tạo marker
          if (this.map.hasLayer(marker)) {
            marker.setLatLng(
              new L.LatLng(newVehicle.latitude, newVehicle.longitude)
            );
          }
        } else {
          if (this.leftPanel.CurrentVehicleState4Search !== '0') {
            this.map.removeLayer(marker);
            const ind = this.ListMarker.findIndex((x) => x === marker);
            this.ListMarker.splice(ind, 1);
          }
        }
      }
      this.updateMarker(marker, vehicle);
    } else {
      if (
        this.getStateVehicleByVelocity(newVehicle) ===
        this.leftPanel.CurrentVehicleState4Search
      ) {
        const v = new Vehicle();
        v.vehiclePlate = newVehicle.vehiclePlate;
        v.velocity = newVehicle.velocity;
        v.velocityMechanical = newVehicle.velocityMechanical;
        v.gpsTime = newVehicle.gpsTime;
        v.vehicleTime = newVehicle.vehicleTime;
        v.stopTime = newVehicle.stopTime;
        v.latitude = newVehicle.latitude;
        v.longitude = newVehicle.longitude;
        v.vehicleId = newVehicle.vehicleId;
        v.iconPath = this.leftPanel.updateIconPathByVelocity(vehicle);
        const m = this.createMarker(v, '', false, true);
        m.id = v.vehicleId;
        if (m.id !== this.CurrentMarker?.id) {
          this.map.addLayer(m);
          this.ListMarker.push(m);
        }
      }
    }
  }

  async showDetailVehicle(vehicle: VehicleDetail): Promise<void> {
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
      vehicle.iconPath = this.leftPanel.updateIconPathByVelocity(vehicle);
      const marker = this.createMarker(vehicle, '', false, true);
      marker.id = vehicle.vehicleId;
      marker.addEventListener('click', () => {
        this.onSelectVehicle(vehicle.vehicleId);
        this.leftPanel.CurrentVehicle = vehicle;
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
    this.leftPanel.CurrentVehicle = new Vehicle();
    this.CurrentMarker = null;
  }
  // Tạo popup hiện trạng xe
  createPopup(vehicle: VehicleDetail): any {
    // tslint:disable-next-line: no-bitwise
    const stateMachine = (vehicle.vehiceState & 8) === 0 ? 'Bật' : 'Tắt';
    // tslint:disable-next-line: no-bitwise
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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NDZhYmY0ZmZiM2U0ZDA0OWQ3ZTAxZWU0OTEwOTNjNSIsInVuaXF1ZV9uYW1lIjpbIjg0NmFiZjRmZmIzZTRkMDQ5ZDdlMDFlZTQ5MTA5M2M1IiwiQmFHUFN2MyJdLCJuYW1lIjoiODQ2YWJmNGZmYjNlNGQwNDlkN2UwMWVlNDkxMDkzYzUiLCJqdGkiOlsiZDQ3Y2IzOTEtNjQ0OC00MmE5LWE3NmMtZTA5OWE3NmRlYzA4IiwiODQ2YWJmNGYtZmIzZS00ZDA0LTlkN2UtMDFlZTQ5MTA5M2M1Il0sImlhdCI6IjE2MTAwOTE2MDA3OTYiLCJjaXAiOiI6OmZmZmY6MTcyLjE5LjAuNCIsInZlciI6IjMiLCJyb2xlIjpbIjEiLCIzIiwiNCIsIjUiLCI2IiwiOSIsIjExIiwiMTIiLCIxMyIsIjE0IiwiMTUiLCIxNiIsIjE3IiwiMjEiLCIyMiIsIjIzIiwiMjQiLCIyNSIsIjI2IiwiMjciLCIzMSIsIjMyIiwiMzMiLCIzNCIsIjUxIiwiNjEiLCI2MiIsIjYzIiwiNjUiLCI2NyIsIjcxIiwiNzIiLCI3MyIsIjc0IiwiNzUiLCI3NiIsIjc3IiwiNzgiLCI3OSIsIjgxIiwiODIiLCI4MyIsIjg0IiwiODYiLCI4NyIsIjkxIiwiOTIiLCI5NiIsIjk3IiwiOTgiLCIxMDEiLCIxMDIiLCIxMjYiLCIxMzAiLCIxMzEiLCIxMzYiLCIxMzciLCIxNTEiLCIxNTIiLCIxNzEiLCIxNzIiLCIxNzMiLCIxOTEiLCIxOTIiLCIxOTMiLCIxOTQiLCIxOTUiLCIyMDEiLCIyMDIiLCIyMDMiLCIyMDQiLCIyMDUiLCIyMTEiLCIyMTIiLCIyMTMiLCIyMTQiLCIyMTUiLCIyNTMiLCIyNTQiLCIyNTUiLCI0NjciLCI0NjgiLCI0NjkiLCI0NzUiLCI0NzYiLCI0NzciLCI0NzgiLCI0ODEiLCI0ODIiLCI0ODMiLCI0ODQiLCI1MDYiLCI1MDciLCI1MDgiLCI1MDkiLCI1MTAiLCI1MjYiLCI1MzEiLCI1NjkiLCI1NzAiLCI1NzEiLCI2MDQiLCI2MDUiLCI2MDYiLCI2MDciLCI2MTMiLCI2MTQiLCI2MTUiLCI2MTYiLCI2NTEiLCI2NTIiLCI2NTMiLCI2NTQiLCI2NTUiLCI2NTYiLCI4MTgiLCI4MTkiLCI4MjAiLCI4NDkiLCI4NTAiLCI4NTEiLCI4NTIiLCI4NTMiLCI4NTQiLCI4NTUiLCI4NTYiLCI4NTciLCI4NTgiLCI4NTkiLCI4NjAiLCI4NjEiLCI4NjIiLCI4NjMiLCI4NjQiLCI4NjUiLCI4NjYiLCI4NjciLCI4NjgiLCI4NjkiLCI5NzAiLCI5OTgiLCIxMDAyIiwiMTA2MyIsIjExMjMiLCIxMTU4IiwiMTIxMCIsIjEyMTEiLCIxMzQzIiwiMTM0NCIsIjEzNDciLCIxMzQ4IiwiMTM1NiIsIjEzNTciLCIxMzU4IiwiMTM1OSIsIjEzNjIiLCIwIl0sIm5hbWVpZCI6Ijg0NmFiZjRmLWZiM2UtNGQwNC05ZDdlLTAxZWU0OTEwOTNjNSIsIlVzZXJOYW1lIjoicmFiYml0biIsIkZ1bGxOYW1lIjoiVGjhu48gTiIsIkF2YXRhclVybCI6IiIsIm5iZiI6MTYxMDA5MTYwMCwiZXhwIjoxNjEwMTA2MDAwLCJpc3MiOiJpZGVudGl0eS1zZXJ2aWNlIn0.NLdpYTFfPoo7FtkrUZj7haMkheBqOMdcC-6y1K87Dzo';
}
