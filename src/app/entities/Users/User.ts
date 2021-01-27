import { BaseEntity } from '../Base/BaseEntity';
export class UserEntity {
  rowNumber: number;
  PK_UserID: string;
  FK_CompanyID: number;
  Username: string;
  UserNameLower: string;
  Password: string;
  Fullname: string;
  UserType: number;
  IsLock: boolean;
  LastPasswordChanged: string;
  ChangePasswordAfterDays: number;
  CreatedByUser: string;
  CreatedDate: string;
  UpdatedByUser: string;
  UpdatedDate: string;
  LastLoginDate: string;
  LockLevel: null;
  IsDeleted: boolean;
  PhoneNumber: string;
  CreatedIP: string;
  UpdatedIP: string;
  Email: string;
  AllowedAccessIP: string;
  UseSecurityCodeSMS: boolean;
  UsernameBAP: null;
  LoginType: null;
}
