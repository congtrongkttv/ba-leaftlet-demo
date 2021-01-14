import { BaseEntity } from '../Base/BaseEntity';
export class Driver extends BaseEntity {
  public RowIndex: number;
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
  rowIndex: number;
  pK_EmployeeID: number;
  employeeCode: string;
  fK_CompanyID: number;
  fK_DepartmentID: number;
  name: string;
  displayName: string;
  birthday: null;
  sex: number;
  address: string;
  mobile: string;
  phoneNumber1: string;
  phoneNumber2: string;
  employeeType: number;
  identityNumber: string;
  driverLicense: string;
  issueLicenseDate: null;
  issueLicensePlace: string;
  expireLicenseDate: null;
  createdByUser: string;
  createdDate: string;
  updatedByUser: string;
  updatedDate: string;
  flags: number;
  isSent: boolean;
  licenseType: null;
  driverImage: null;
}

export interface ResponseResult {
  mess: any;
  data: any;
}
