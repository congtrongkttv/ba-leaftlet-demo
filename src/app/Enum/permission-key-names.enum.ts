export enum PermissionKeyNames {
  /**
   * Không cần quyền
   */
  noPermission = -1,

  /**
   * chưa gán quyền
   */
  none = 0,

  /**
   * Quyền cho trang ds người dùng
   */
  userView = 1,
  userAdd = 2,
  userExport = 3,
  userOption = 4,
  /**
   * Quyền cho trang danh sách lái xe
   */
  driverView = 5,
  driverAdd = 6,
  driverUpdate = 7,
  driverDelete = 8,
  driverExport = 9,
  driverOption = 10,
}
