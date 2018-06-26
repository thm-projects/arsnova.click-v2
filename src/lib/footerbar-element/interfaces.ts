import { Observable } from 'rxjs';

export declare interface IFooterBarElement {
  id: string;
  iconClass: string;
  textClass: string;
  textName: string;
  selectable: boolean;
  showIntro: boolean;
  linkTarget?: Function | Array<string> | string;
  onClickCallback?: Function;
  restoreClickCallback?: Function;
  isActive?: Observable<boolean> | boolean;
}
