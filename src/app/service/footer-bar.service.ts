import {Injectable} from '@angular/core';

export class FooterbarElement {
  set onClickCallback(value: Function) {
    this._restoreOnClickCallback = this._onClickCallback;
    this._onClickCallback = value;
  }

  set linkTarget(value: Function | string) {
    this._linkTarget = value;
  }

  get selectable(): boolean {
    return this._selectable;
  }

  get showIntro(): boolean {
    return this._showIntro;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get id(): string {
    return this._id;
  }

  get iconClass(): string {
    return this._iconClass;
  }

  get textClass(): string {
    return this._textClass;
  }

  get textName(): string {
    return this._textName;
  }

  get linkTarget(): Function | string {
    return this._linkTarget;
  }

  get onClickCallback(): Function {
    return this._onClickCallback;
  }

  readonly _id: string;
  readonly _iconClass: string;
  readonly _textClass: string;
  readonly _textName: string;
  readonly _selectable: boolean;
  readonly _showIntro: boolean;

  private _onClickCallback: Function;
  private _restoreOnClickCallback: Function;
  private _linkTarget: Function | string;
  private _isActive: boolean;

  constructor({id, iconClass, textClass, textName, selectable, showIntro, isActive, linkTarget}: any, onClickCallback?: Function) {
    this._id = id;
    this._iconClass = iconClass;
    this._textClass = textClass;
    this._textName = textName;
    this._selectable = selectable;
    this._showIntro = showIntro;
    this._isActive = isActive;
    this._linkTarget = linkTarget;
    this._onClickCallback = onClickCallback;
  }

  public restoreClickCallback() {
    if (!this._restoreOnClickCallback) {
      return;
    }
    this._onClickCallback = this._restoreOnClickCallback;
  }
}

@Injectable()
export class FooterBarService {

  public footerElemTranslation: FooterbarElement = new FooterbarElement({
    id: 'translation',
    iconClass: 'fa fa-globe',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.languages',
    selectable: false,
    showIntro: false,
    linkTarget: '/languages'
  }, function () {
  });
  public footerElemSound: FooterbarElement = new FooterbarElement({
    id: 'sound',
    iconClass: 'fa fa-music',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.sound',
    selectable: false,
    showIntro: true,
    linkTarget: '/quiz/manager/sound',
  }, function () {

  });
  public footerElemReadingConfirmation: FooterbarElement = new FooterbarElement({
    id: 'reading-confirmation',
    iconClass: 'fa fa-eye',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.reading-confirmation',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  public footerElemTheme: FooterbarElement = new FooterbarElement({
    id: 'theme',
    iconClass: 'fa fa-apple',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.style',
    selectable: false,
    showIntro: false,
    linkTarget: '/themes',
  }, function () {

  });
  public footerElemImport: FooterbarElement = new FooterbarElement({
    id: 'import',
    iconClass: 'fa fa-upload',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.import',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function () {
    document.getElementById('upload-session').click();
  });
  public footerElemHashtagManagement: FooterbarElement = new FooterbarElement({
    id: 'sessionManagement',
    iconClass: 'fa fa-wrench',
    textClass: 'footerElementText',
    textName: 'component.hashtag_management.session_management',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/overview',
  }, function () {

  });
  public footerElemFullscreen: FooterbarElement = new FooterbarElement({
    id: 'fullscreen',
    iconClass: 'fa fa-arrows-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.fullscreen',
    selectable: true,
    showIntro: false,
    linkTarget: null,
    isActive: window.innerWidth === screen.width && window.innerHeight === screen.height
  }, function () {
    this.isActive = !this.isActive;
    const elem = document.documentElement;
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });
  public footerElemHome: FooterbarElement = new FooterbarElement({
    id: 'home',
    iconClass: 'fa fa-home',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.home',
    selectable: false,
    showIntro: false,
    linkTarget: '/',
  }, function () {

  });
  public footerElemAbout: FooterbarElement = new FooterbarElement({
    id: 'about',
    iconClass: 'fa fa-info-circle',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.info',
    selectable: false,
    showIntro: false,
    linkTarget: ['info', 'about'],
  }, function () {

  });
  public footerElemQRCode: FooterbarElement = new FooterbarElement({
    id: 'qr-code',
    iconClass: 'fa fa-qrcode',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.qr_code',
    selectable: false,
    showIntro: true,
    linkTarget: null,
  }, function () {
  });
  public footerElemNicknames: FooterbarElement = new FooterbarElement({
    id: 'nicknames',
    iconClass: 'fa fa-users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.nicknames',
    selectable: false,
    showIntro: true,
    linkTarget: '/quiz/manager/nicknames',
  }, function () {

  });
  public footerElemEditQuiz: FooterbarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: 'fa fa-pencil-square-o',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit_quiz',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function () {

  });
  public footerElemProductTour: FooterbarElement = new FooterbarElement({
    id: 'product-tour',
    iconClass: 'fa fa-flag',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_product_tour',
    selectable: true,
    showIntro: false,
    linkTarget: null,
    isActive: JSON.parse(localStorage.getItem('config.show-product-tour'))
  }, function () {
    this.isActive = !this.isActive;
    localStorage.setItem('config.show-product-tour', this.isActive);
  });
  public footerElemResponseProgress: FooterbarElement = new FooterbarElement({
    id: 'response-progress',
    iconClass: 'fa fa-align-left',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_response_progress',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  public footerElemConfidenceSlider: FooterbarElement = new FooterbarElement({
    id: 'confidence-slider',
    iconClass: 'fa fa-sliders',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_confidence_slider',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  public footerElemBack: FooterbarElement = new FooterbarElement({
    id: 'back',
    iconClass: 'fa fa-undo',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.back',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function () {
    history.back();
  });
  public footerElemStartQuiz: FooterbarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fa fa-paper-plane',
    textClass: 'footerElementText',
    textName: 'component.lobby.start_quiz',
    selectable: true,
    showIntro: false,
  }, function () {
  });
  public footerElemExport: FooterbarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fa fa-download',
    textClass: 'footerElementText',
    textName: 'component.leaderboard.export',
    selectable: false,
    showIntro: false,
    linkTarget: null
  }, function () {
  });
  public footerElemSaveAssets: FooterbarElement = new FooterbarElement({
    id: 'saveAssets',
    iconClass: 'fa fa-cloud',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.cache_assets',
    selectable: true,
    showIntro: false,
    linkTarget: null
  }, function () {
  });
  public footerElemBlockRudeNicknames: FooterbarElement = new FooterbarElement({
    id: 'blockRudeNicknames',
    iconClass: 'fa fa-lock',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.block_rude_nicknames',
    selectable: true,
    showIntro: false,
    linkTarget: null
  }, function () {
  });
  public footerElemEnableCasLogin: FooterbarElement = new FooterbarElement({
    id: 'enableCasLogin',
    iconClass: 'fa fa-sign-in',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.enable_cas_login',
    selectable: true,
    showIntro: false,
    linkTarget: null
  }, function () {
  });
  public footerElemLeaderboard: FooterbarElement = new FooterbarElement({
    id: 'leaderboard',
    iconClass: 'fa fa-trophy',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.global_leaderboard',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/flow/leaderboard',
  }, function () {
  });

  get footerElements(): Array<FooterbarElement> {
    return this._footerElements;
  }

  private _footerElements: Array<FooterbarElement> = [];

  constructor() {
  }

  public replaceFooterElements(elements: Array<FooterbarElement>) {
    this._footerElements = elements;
  }

}
