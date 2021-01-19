import { BaseEntity } from '../Base/BaseEntity';
export class Driver extends BaseEntity {
  public DriverID: number;
  public FullName: string;
  public BirthDay: string;
  public LiscenseDriver: string;
  public LiscenseDay: string;
  constructor() {
    super();
  }
}

export class DriverEntity {
  PK_EmployeeID: number;
  EmployeeCode: string;
  FK_CompanyID: number;
  FK_DepartmentID: number;
  Name: string;
  DisplayName: string;
  Birthday: null;
  Sex: number;
  Address: string;
  Mobile: string;
  PhoneNumber1: string;
  PhoneNumber2: string;
  EmployeeType: number;
  IdentityNumber: string;
  DriverLicense: string;
  IssueLicenseDate: null;
  IssueLicensePlace: string;
  ExpireLicenseDate: null;
  CreatedByUser: string;
  CreatedDate: string;
  UpdatedByUser: string;
  UpdatedDate: string;
  Flags: number;
  IsSent: boolean;
  LicenseType: null;
  DriverImage: null;
}

export interface ResponseResult {
  mess: any;
  data: any;
}
