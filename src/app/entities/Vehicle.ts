export class Vehicle {
  public vehicleId: number;
  public vehiclePlate: string;
  public latitude: number;
  public longitude: number;
  public state: number;
  public velocity: number;
  public gpsTime: Date;
  public vehicleTime: Date;
  public dataExt: number;
  public stopTime: number;
  public lastTimeMove: Date;
  public velocityMechanical: number;
  public iconCode: number;
  public iconPath: string;
  public privateCode: string;
  public address: string;
  public isLocked: boolean;
  public isShow: boolean;
  public flags: number;
  public xnCode: number;
  public direction: number;
  constructor(data?: any) {
    if (data != null && data !== undefined) {
      this.vehicleId = data[0];
      this.vehiclePlate = data[1];
      this.latitude = data[2];
      this.longitude = data[3];
      this.state = data[4];
      this.velocity = data[5];
      this.gpsTime = data[6];
      this.vehicleTime = data[7];
      this.iconCode = data[8];
      this.privateCode = data[9];
      this.dataExt = data[14];
      this.direction = data[17];
      this.stopTime = data[22];
    }
  }
}

export class APIResponseModel {
  data: any;
  statusCode: number;
  responseCode: number;
  userMessage: string;
  internalMessage: string;
}
