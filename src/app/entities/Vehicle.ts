export class Vehicle {
  VehicleId: number;
  VehiclePlate: string;
  Latitude: number;
  Longitude: number;
  State: number;
  Velocity: number;
  GPSTime: Date;
  VehicleTime: Date;
  IconCode: number;
  constructor(data: any) {
    this.VehicleId = data[0];
    this.VehiclePlate = data[1];
    this.Latitude = data[2];
    this.Longitude = data[3];
    this.State = data[4];
    this.Velocity = data[5];
    this.GPSTime = data[6];
    this.VehicleTime = data[7];
    this.IconCode = data[8];
  }
}

export class APIResponseModel {
  data: any;
  statusCode: number;
  responseCode: number;
  userMessage: string;
  internalMessage: string;
}
