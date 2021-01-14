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
  public RowIndex: number;
  public pKEmployeeID: number;
  public displayName: string;
  public employeeCode: string;
  public name: Date;
  constructor() {}
}
