import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VehicleEntity } from '../entities/VehicleEntity';
import { Vehicle } from '../entities/Vehicle';

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.css'],
})
export class LeftpanelComponent implements OnInit {
  @Output() OnRefresh = new EventEmitter<any>();
  @Output() OnGetListVehicles = new EventEmitter<any>();
  @Output() OnSelectVehicle = new EventEmitter<any>();
  public listVehicleOnlines: VehicleEntity[];
  public listVehicles: Vehicle[];
  public ListVehicleOnlinesTemp: VehicleEntity[] = [];
  public ListVehiclesTemp: Vehicle[] = [];
  public currentTextSearch: string;
  public CurrentVehicleIDSelected = -1;
  @Input() IsOnlinePage;
  public IsUseCluster = false;

  constructor() {}

  ngOnInit(): void {}

  onSearch(): void {
    if (this.currentTextSearch === '') {
      if (this.IsOnlinePage) {
        this.ListVehicleOnlinesTemp = this.listVehicleOnlines;
      } else {
        this.ListVehiclesTemp = this.listVehicles;
      }
    } else {
      if (this.IsOnlinePage) {
        this.ListVehicleOnlinesTemp = this.listVehicleOnlines.filter((x) =>
          x.VehiclePlate.toLowerCase().includes(
            this.currentTextSearch.toLowerCase()
          )
        );
      } else {
        this.ListVehiclesTemp = this.listVehicles.filter((x) =>
          x.VehiclePlate.toLowerCase().includes(
            this.currentTextSearch.toLowerCase()
          )
        );
      }
    }
  }

  onChangeUseCluster(e: any): void {
    this.IsUseCluster = e.target.checked;
    localStorage.setItem('IsUseClusterMarkerTracking', e.target.checked);
    this.OnRefresh.emit();
  }

  selectVehicle(vehicleID: number): void {
    this.CurrentVehicleIDSelected = vehicleID;
    this.OnSelectVehicle.emit(vehicleID);
  }
}
