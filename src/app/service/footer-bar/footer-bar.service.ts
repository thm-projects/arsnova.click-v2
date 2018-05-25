import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';

@Injectable()
export class FooterBarService {

  public TYPE_REFERENCE: string;

  public footerElemTranslation: IFooterBarElement = new FooterbarElement({
    id: 'translation',
    iconClass: 'fas fa-globe',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.languages',
    selectable: false,
    showIntro: false,
    linkTarget: '/languages',
  }, function (): void {
  });
  public footerElemSound: IFooterBarElement = new FooterbarElement({
    id: 'sound',
    iconClass: 'fas fa-music',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.sound',
    selectable: false,
    showIntro: true,
    linkTarget: '/quiz/manager/sound',
  }, function (): void {

  });
  public footerElemReadingConfirmation: IFooterBarElement = new FooterbarElement({
    id: 'reading-confirmation',
    iconClass: 'fas fa-eye',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.reading-confirmation',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function (): void {

  });
  public footerElemTheme: IFooterBarElement = new FooterbarElement({
    id: 'theme',
    iconClass: 'fab fa-apple',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.style',
    selectable: false,
    showIntro: false,
    linkTarget: '/themes',
  }, function (): void {

  });
  public footerElemImport: IFooterBarElement = new FooterbarElement({
    id: 'import',
    iconClass: 'fas fa-upload',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.import',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
    if (document) {
      document.getElementById('upload-session').click();
    }
  });
  public footerElemHashtagManagement: IFooterBarElement = new FooterbarElement({
    id: 'sessionManagement',
    iconClass: 'fas fa-wrench',
    textClass: 'footerElementText',
    textName: 'component.hashtag_management.session_management',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/overview',
  }, function (): void {

  });
  public footerElemFullscreen: IFooterBarElement = new FooterbarElement({
    id: 'fullscreen',
    iconClass: 'fas fa-arrows-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.fullscreen',
    selectable: true,
    showIntro: false,
    linkTarget: null,
    isActive: isPlatformBrowser(this.platformId) ? window.innerWidth === screen.width && window.innerHeight === screen.height : false,
  }, function (): void {
    this.isActive = !this.isActive;
    if (document) {
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
    }
  });
  public footerElemHome: IFooterBarElement = new FooterbarElement({
    id: 'home',
    iconClass: 'fas fa-home',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.home',
    selectable: false,
    showIntro: false,
    linkTarget: '/',
  }, function (): void {

  });
  public footerElemAbout: IFooterBarElement = new FooterbarElement({
    id: 'about',
    iconClass: 'fas fa-info-circle',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.info',
    selectable: false,
    showIntro: false,
    linkTarget: ['info', 'about'],
  }, function (): void {

  });
  public footerElemQRCode: IFooterBarElement = new FooterbarElement({
    id: 'qr-code',
    iconClass: 'fas fa-qrcode',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.qr_code',
    selectable: false,
    showIntro: true,
    linkTarget: null,
  }, function (): void {
  });
  public footerElemNicknames: IFooterBarElement = new FooterbarElement({
    id: 'nicknames',
    iconClass: 'fas fa-users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.nicknames',
    selectable: false,
    showIntro: true,
    linkTarget: '/quiz/manager/nicknames',
  }, function (): void {

  });
  public footerElemEditQuiz: IFooterBarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: 'fas fa-edit',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit_quiz',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function (): void {

  });
  public footerElemProductTour: IFooterBarElement = new FooterbarElement({
    id: 'product-tour',
    iconClass: 'fas fa-flag',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_product_tour',
    selectable: true,
    showIntro: false,
    linkTarget: null,
    isActive: isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('config.show-product-tour')) : false,
  }, function (): void {
    this.isActive = !this.isActive;
    if (localStorage) {
      localStorage.setItem('config.show-product-tour', this.isActive);
    }
  });
  public footerElemResponseProgress: IFooterBarElement = new FooterbarElement({
    id: 'response-progress',
    iconClass: 'fas fa-align-left',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_response_progress',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function (): void {

  });
  public footerElemConfidenceSlider: IFooterBarElement = new FooterbarElement({
    id: 'confidence-slider',
    iconClass: 'fas fa-sliders-h',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_confidence_slider',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function (): void {

  });
  public footerElemBack: IFooterBarElement = new FooterbarElement({
    id: 'back',
    iconClass: 'fas fa-undo',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.back',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
    history.back();
  });
  public footerElemStartQuiz: IFooterBarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fas fa-paper-plane',
    textClass: 'footerElementText',
    textName: 'component.lobby.start_quiz',
    selectable: true,
    showIntro: false,
  }, function (): void {
  });
  public footerElemExport: IFooterBarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fas fa-download',
    textClass: 'footerElementText',
    textName: 'component.leaderboard.export',
    selectable: false,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
  });

  /*
   * Currently unused since the server decides if it will cache the quiz contents
   */
  public footerElemSaveAssets: IFooterBarElement = new FooterbarElement({
    id: 'saveAssets',
    iconClass: 'fas fa-cloud',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.cache_assets',
    selectable: true,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
  });

  public footerElemBlockRudeNicknames: IFooterBarElement = new FooterbarElement({
    id: 'blockRudeNicknames',
    iconClass: 'fas fa-lock',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.block_rude_nicknames',
    selectable: true,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
  });
  public footerElemEnableCasLogin: IFooterBarElement = new FooterbarElement({
    id: 'enableCasLogin',
    iconClass: 'fas fa-sign-in-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.enable_cas_login',
    selectable: true,
    showIntro: false,
    linkTarget: null,
  }, function (): void {
  });
  public footerElemLeaderboard: IFooterBarElement = new FooterbarElement({
    id: 'leaderboard',
    iconClass: 'fas fa-trophy',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.global_leaderboard',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/flow/leaderboard',
  }, function (): void {
  });
  public footerElemMemberGroup: IFooterBarElement = new FooterbarElement({
    id: 'memberGroup',
    iconClass: 'fas fa-users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.member_group',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/manager/memberGroup',
  }, function (): void {
  });

  private _footerElements: Array<IFooterBarElement> = [];

  get footerElements(): Array<IFooterBarElement> {
    return this._footerElements;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public replaceFooterElements(elements: Array<IFooterBarElement>): void {
    this._footerElements = elements;
  }

}
