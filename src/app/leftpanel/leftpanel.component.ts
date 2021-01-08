import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Vehicle } from '../entities/Vehicle';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { VehicleOnline } from '../entities/VehicleOnline';
import { DirectionService } from '../Services/Direction/direction.service';

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss'],
})
export class LeftpanelComponent implements OnInit, AfterViewInit {
  @ViewChild(VirtualScrollerComponent)
  virtualScroller: VirtualScrollerComponent;
  @ViewChild(AutocompleteComponent)
  autocompleteVehicle: AutocompleteComponent;

  @Output() OnRefresh = new EventEmitter<any>();
  @Output() OnChangeVehicleState = new EventEmitter<any>();
  @Output() OnGetListVehicles = new EventEmitter<any>();
  @Output() OnSelectVehicle = new EventEmitter<any>();
  @Input() CurrentVehicle: Vehicle = new Vehicle();
  public listVehicleOnlines: Vehicle[];
  public listVehicles: Vehicle[];
  public ListVehicleOnlinesTemp: Vehicle[] = [];
  public ListVehiclesTemp: Vehicle[] = [];
  public CurrentVehicleState4Search = '0';
  public dropdownVehicleState: {
    id: string;
    description: string;
  }[] = [];
  public IsUseCluster = false;
  numberVehicleLostGPS = 0;
  numberVehicleXeDungDo = 0;
  numberVehicleDiChuyen = 0;
  numberVehicleQuaTocDo = 0;
  constructor(private direction: DirectionService) {}
  ngAfterViewInit(): void {
    this.autocompleteVehicle.registerOnChange((e) => {
      if (e === '') {
        this.CurrentVehicle = new Vehicle();
      }
    });
  }

  ngOnInit(): void {}

  selectVehicle(vehicle: Vehicle): void {
    this.CurrentVehicle = vehicle;
    this.OnSelectVehicle.emit(this.CurrentVehicle.vehicleId);
  }

  selectVehicleState(vehicleStateID: string): void {
    this.CurrentVehicleState4Search = vehicleStateID;
    if (vehicleStateID === '0') {
      this.sortListVehicle();
    } else if (vehicleStateID === '1') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity < 5
      );
    } else if (vehicleStateID === '2') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 5 &&
          x.velocity < 60
      );
    } else if (vehicleStateID === '3') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 60
      );
    } else if (vehicleStateID === '4') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 <= new Date().getTime()
      );
    }
    // Kiểm tra xem xe hiện tại đang theo dõi đã có trong ds đang xe hay chưa?
    // Nếu chưa có thì insert vào để theo dõi
    if (
      this.CurrentVehicle.vehicleId != null &&
      this.CurrentVehicle.vehicleId !== undefined
    ) {
      if (
        this.ListVehiclesTemp.filter(
          (x) => x.vehicleId === this.CurrentVehicle.vehicleId
        ).length === 0
      ) {
        this.ListVehiclesTemp.push(this.CurrentVehicle);
      }
    }
    this.OnChangeVehicleState.emit(this.CurrentVehicleState4Search);
  }

  sortListVehicle(): void {
    if (this.CurrentVehicleState4Search === '0') {
      const dataLostGps = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 <= new Date().getTime()
      );
      const dataNomal = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime()
      );
      this.ListVehiclesTemp = [];
      dataNomal.forEach((element) => {
        this.ListVehiclesTemp.push(element);
      });
      dataLostGps.forEach((element) => {
        this.ListVehiclesTemp.push(element);
      });
    } else if (this.CurrentVehicleState4Search === '1') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity < 5
      );
    } else if (this.CurrentVehicleState4Search === '2') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 5 &&
          x.velocity < 60
      );
    } else if (this.CurrentVehicleState4Search === '3') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
          x.velocity >= 60
      );
    } else if (this.CurrentVehicleState4Search === '4') {
      this.ListVehiclesTemp = this.listVehicles.filter(
        (x) =>
          new Date(x.vehicleTime).getTime() + 3600000 <= new Date().getTime()
      );
    }
    // Kiểm tra xem xe hiện tại đang theo dõi đã có trong ds đang xe hay chưa?
    // Nếu chưa có thì insert vào để theo dõi
    if (
      this.CurrentVehicle.vehicleId != null &&
      this.CurrentVehicle.vehicleId !== undefined
    ) {
      if (
        this.ListVehiclesTemp.filter(
          (x) => x.vehicleId === this.CurrentVehicle.vehicleId
        ).length === 0
      ) {
        this.ListVehiclesTemp.push(this.CurrentVehicle);
      }
    }

    // Cập nhật lại số lượng xe ở các trạng thái
    this.numberVehicleXeDungDo = this.listVehicles.filter(
      (x) =>
        new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
        x.velocity < 5
    ).length;
    this.numberVehicleDiChuyen = this.listVehicles.filter(
      (x) =>
        new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
        x.velocity >= 5 &&
        x.velocity < 60
    ).length;
    this.numberVehicleQuaTocDo = this.listVehicles.filter(
      (x) =>
        new Date(x.vehicleTime).getTime() + 3600000 > new Date().getTime() &&
        x.velocity >= 60
    ).length;

    this.numberVehicleLostGPS = this.listVehicles.filter(
      (x) => new Date(x.vehicleTime).getTime() + 3600000 <= new Date().getTime()
    ).length;
  }
  public async updateListVehicleOnline(
    newVehicle: VehicleOnline
  ): Promise<void> {
    // update danh sách xe bên trái
    let oldLat: number;
    let oldLng: number;
    const vehicle = this.listVehicles.find(
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
}
