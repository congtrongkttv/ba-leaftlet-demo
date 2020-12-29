import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { VehicleEntity } from '../entities/VehicleEntity';
import { Vehicle } from '../entities/Vehicle';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss'],
})
export class LeftpanelComponent implements OnInit, AfterViewInit {
  @ViewChild(VirtualScrollerComponent)
  virtualScroller: VirtualScrollerComponent;
  @Output() OnRefresh = new EventEmitter<any>();
  @Output() OnChangeVehicleState = new EventEmitter<any>();
  @Output() OnGetListVehicles = new EventEmitter<any>();
  @Output() OnSelectVehicle = new EventEmitter<any>();
  public listVehicleOnlines: VehicleEntity[];
  public listVehicles: Vehicle[];
  public ListVehicleOnlinesTemp: VehicleEntity[] = [];
  public ListVehiclesTemp: Vehicle[] = [];
  public currentTextSearch: string;
  public CurrentVehicleState4Search = '0';
  public CurrentVehicleIDSelected = -1;
  public CurrentSelectedVehicle: Vehicle;
  public dropdownVehicleState: {
    id: string;
    description: string;
  }[] = [];
  @Input() IsOnlinePage;
  public IsUseCluster = false;

  constructor() {}
  ngAfterViewInit(): void {
    this.dropdownVehicleState.push({ id: '0', description: 'Tất cả' });
    this.dropdownVehicleState.push({ id: '1', description: 'Xe dừng đỗ' });
    this.dropdownVehicleState.push({
      id: '2',
      description: 'Xe di chuyển',
    });
    this.dropdownVehicleState.push({
      id: '3',
      description: 'Xe quá tốc độ',
    });
    this.dropdownVehicleState.push({
      id: '4',
      description: 'Xe mất tín hiệu',
    });
  }

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
  }

  selectVehicle(vehicle: Vehicle): void {
    this.CurrentVehicleIDSelected = vehicle.VehicleId;
    this.OnSelectVehicle.emit(this.CurrentVehicleIDSelected);
  }

  selectVehicleState(vehicleStateID: string): void {
    this.CurrentVehicleState4Search = vehicleStateID;
    this.OnChangeVehicleState.emit(this.CurrentVehicleState4Search);
  }
}
