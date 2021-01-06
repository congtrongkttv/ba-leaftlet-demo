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
  public listVehicleOnlines: Vehicle[];
  public listVehicles: Vehicle[];
  public ListVehicleOnlinesTemp: Vehicle[] = [];
  public ListVehiclesTemp: Vehicle[] = [];
  public currentTextSearch: string;
  public CurrentVehicleState4Search = '0';
  public CurrentVehicleIDSelected = -1;
  public CurrentSelectedVehicle: Vehicle;
  public CurrentSelectedVehiclePlate = '';
  public dropdownVehicleState: {
    id: string;
    description: string;
  }[] = [];
  public IsUseCluster = false;
  numberVehicleLostGPS = 0;
  numberVehicleXeDungDo = 0;
  numberVehicleDiChuyen = 0;
  numberVehicleQuaTocDo = 0;
  constructor() {}
  ngAfterViewInit(): void {
    this.autocompleteVehicle.registerOnChange((e) => {
      if (e === '') {
        this.CurrentVehicleIDSelected = -1;
      }
    });
  }

  ngOnInit(): void {}

  selectVehicle(vehicle: Vehicle): void {
    this.CurrentVehicleIDSelected = vehicle.vehicleId;
    this.OnSelectVehicle.emit(this.CurrentVehicleIDSelected);
  }

  selectVehicleState(vehicleStateID: string): void {
    this.CurrentVehicleState4Search = vehicleStateID;
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
}
