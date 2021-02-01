import { CurrentData } from '../Page/tracking/tracking.component';
import { PermissionKeyNames } from '../Enum/permission-key-names.enum';

export interface AuthorizeBase {
  canView: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canExport: boolean;
  canOption: boolean;
}

export class PermissionBase {
  permissionView: number = PermissionKeyNames.none;
  permissionAdd?: number = PermissionKeyNames.none;
  permissionUpdate?: number = PermissionKeyNames.none;
  permissionDelete?: number = PermissionKeyNames.none;
  permissionExport: number = PermissionKeyNames.none;
  permissionOption: number = PermissionKeyNames.none;
}
