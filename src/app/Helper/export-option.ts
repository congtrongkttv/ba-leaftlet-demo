export interface ExportOption {
  /**
   * font chữ cho cả file excel
   */
  fontFamily?: string;
  fontSize?: number;

  /**
   * THuộc tính của title
   */
  titlefontSize?: number;
  titleBold?: boolean;
  titleColor?: string;

  /**
   * Thuộc tính của header bảng dữ liệu
   */
  headerColor?: string;
  headerBold?: boolean;
  headerBackground?: string;
  headerFontSize?: number;
  headerAlignText?: 'left' | 'center' | 'right';
  headerVerticalAlignText?: 'top' | 'center' | 'bottom';

  /**
   * Thuộc tính của footer
   */
  footerColor?: string;
  footerBold?: boolean;
  footerBackground?: string;
  footerFontSize?: number;
  footerAlignText?: 'left' | 'center' | 'right';
  footerVerticalAlignText?: 'top' | 'center' | 'bottom';

  wrap?: boolean;
}
