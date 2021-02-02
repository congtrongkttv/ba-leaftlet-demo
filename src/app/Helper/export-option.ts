export interface ExportOption {
  // Có dòng summary hay không?
  isSummary?: boolean;

  // hewader có gộp cột hay không?>
  isGroupHeader: boolean;

  // Tiêu đề báo cáo
  reportTitle?: string;

  // Ngày báo cáo
  reportDate?: string;

  // Xe đang làm việc
  reportVehicle?: string;

  // Nội dung tìm kiếm để xuất bc
  reportContent?: string;

  // Tên  của sheet
  sheetName?: string;

  // Tên fiel bc
  reportName?: string;

  // Dữ liệu báo cáo để lấy thông tin chi tiết (chỉ dành cho master detail)
  reportList?: any;

  // Trang general-base-report => để có thể gọi được dữ liệu từ export-helper.
  baseComponent?: any;
}

export interface ExportExcelOption {
  InputData?: any;
  Template: {
    ReportTitle: string;
    ReportSubtitleLevel1: string;
    ReportSubtitleLevel2: string;
    reportContent?: string;
    FileName: string;
    SheetName: string;
    Landscape?: boolean;
    SettingColumns: any[];
    isSummary?: boolean;
    isGroupHeader?: boolean;
    baseComponent?: any;
    reportList?: any;
  };
}
