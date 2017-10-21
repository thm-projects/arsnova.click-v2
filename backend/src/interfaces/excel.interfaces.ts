
import {ExcelTheme} from '../export/lib/excel_default_styles';

export declare interface IExcelWorkbook {
  theme: ExcelTheme;
}

export declare interface IExcelWorksheet {
  formatSheet(): void;
  addSheetData(): void;
}
