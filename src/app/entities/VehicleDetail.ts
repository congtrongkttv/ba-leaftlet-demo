// Generated by https://quicktype.io

export class VehicleDetail {
  kindID: number;
  vehicleID: number;
  vehiclePlate: string;
  latitude: number;
  longitude: number;
  vehiceState: number;
  velocityGPS: number;
  velocityMechanical: number;
  gpsTime: string;
  vehicleTime: string;
  iconCode: number;
  privateCode: string;
  groupNames: null;
  accStatus: boolean;
  totalKm: number;
  stopTime: number;
  feeMessage: null;
  feeMessageDetail: null;
  speedOverCount: number;
  battery: number;
  ben: boolean;
  currentAddress: null;
  address: string;
  mcExpried: string;
  concretePump: boolean;
  imei: null;
  stopCount: number;
  airCondition: boolean;
  airConditionerStr: null;
  concrete: boolean;
  crane: boolean;
  door: boolean;
  phoneNumber: null;
  extTransport: EXTTransport;
  fuel: Fuel;
  temperature: Temperature;
  onlineExtend: OnlineExtend;
}

export class EXTTransport {
  vin: string;
  name: string;
  license: string;
  el_date: string;
  mobile: string;
  speed_o: number;
  door: number;
  vio_count: number;
  t_continus: number;
  t_day: number;
  m_label: string;
  p_label: null;
  d_name: string;
}

export class Fuel {
  width: number;
  isUseFuel: boolean;
  PulsesValue: string;
  liters: number;
  capacity: number;
}

export class OnlineExtend {
  m_on: number;
  m_on_stop: number;
  u_label: string;
  g_time: string;
  acc_kmco: number;
  acc_kmgps: number;
  l_money: number;
  t_money: number;
  s_time: string;
}

export class Temperature {
  ndo: number;
  ndo2: number;
  lstTemp: any[];
}