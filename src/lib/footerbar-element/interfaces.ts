export declare interface IFooterBarElement {
  id: string;
  iconClass: string;
  textClass: string;
  textName: string;
  selectable: boolean;
  showIntro: boolean;
  linkTarget?: Function | Array<string> | string;
  queryParams?: object;
  onClickCallback?: Function;
  restoreClickCallback?: Function;
  isActive?: boolean;
}
