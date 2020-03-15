import { IconParams, IconProp } from '@fortawesome/fontawesome-svg-core';

export declare interface IFooterBarElement {
  id: string;
  iconLayer?: Array<IconParams>;
  iconClass?: IconProp;
  iconColorClass?: string;
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
  isLoading?: boolean;
}
