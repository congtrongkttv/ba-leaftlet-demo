import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-popup',
  templateUrl: './vehicle-popup.component.html',
  styleUrls: ['./vehicle-popup.component.css'],
})
export class VehiclePopupComponent implements OnInit {
  constructor() {}
  VehiclePlate: string;
  VehicleTime: string;
  Velocity: string;
  Location: string;
  Address: string;
  MachineState: string;
  DoorState: string;
  NearestVehicles: string;
  ngOnInit(): void {}
}
