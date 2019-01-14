export declare interface IFooterBarElement {
  id: string;
  iconClass: string;
  textClass: string;
  textName: string;
  selectable: boolean;
  showIntro: boolean;
  introTranslate?: string;
  linkTarget?: Function | Array<string>;
  queryParams?: object;
  onClickCallback?: Function;
  restoreClickCallback?: Function;
  isActive?: boolean;
}
