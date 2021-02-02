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
