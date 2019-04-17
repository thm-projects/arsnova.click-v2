import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { IndexedDbService } from '../storage/indexed.db.service';

declare class Modernizr {
  public static fullscreen: boolean;
}

interface IFsDocument extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}

export function isFullScreen(): boolean {
  const fsDoc = <IFsDocument>document;

  return !!((fsDoc as any).fullscreenElement || fsDoc.mozFullScreenElement || (fsDoc as any).webkitFullscreenElement || fsDoc.msFullscreenElement);
}

interface IFsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}

export function toggleFullScreen(): void {
  const fsDoc = <IFsDocument>document;

  if (!isFullScreen()) {
    const fsDocElem = <IFsDocumentElement>document.documentElement;

    if (fsDocElem.requestFullscreen) {
      (fsDocElem as any).requestFullscreen();
    } else if (fsDocElem.msRequestFullscreen) {
      fsDocElem.msRequestFullscreen();
    } else if (fsDocElem.mozRequestFullScreen) {
      fsDocElem.mozRequestFullScreen();
    } else if ((fsDocElem as any).webkitRequestFullscreen) {
      (fsDocElem as any).webkitRequestFullscreen();
    }
  } else if (fsDoc.exitFullscreen) {
    (fsDoc as any).exitFullscreen();
  } else if (fsDoc.msExitFullscreen) {
    fsDoc.msExitFullscreen();
  } else if (fsDoc.mozCancelFullScreen) {
    fsDoc.mozCancelFullScreen();
  } else if ((fsDoc as any).webkitExitFullscreen) {
    (fsDoc as any).webkitExitFullscreen();
  }
}

export function setFullScreen(full: boolean): void {
  if (full !== isFullScreen()) {
    toggleFullScreen();
  }
}

@Injectable()
export class FooterBarService {

  public TYPE_REFERENCE: string;

  public footerElemTranslation: IFooterBarElement = new FooterbarElement({
    id: 'translation',
    iconClass: 'globe',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.languages',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.translation',
    linkTarget: ['/', 'languages'],
  }, function (): void {
  });
  public footerElemSound: IFooterBarElement = new FooterbarElement({
    id: 'sound',
    iconClass: 'music',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.sound',
    selectable: false,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.sound',
    linkTarget: ['/', 'quiz', 'manager', 'sound'],
  }, function (): void {

  });
  public footerElemReadingConfirmation: IFooterBarElement = new FooterbarElement({
    id: 'reading-confirmation',
    iconClass: 'eye',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.reading-confirmation',
    selectable: true,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.reading-confirmation',
    linkTarget: null,
  }, function (): void {

  });
  public footerElemTheme: IFooterBarElement = new FooterbarElement({
    id: 'theme',
    iconClass: 'apple-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.style',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.theme',
    linkTarget: ['/', 'themes'],
  }, function (): void {

  });
  public footerElemImport: IFooterBarElement = new FooterbarElement({
    id: 'import',
    iconClass: 'upload',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.import',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.import',
    linkTarget: null,
  }, function (): void {
    if (document) {
      document.getElementById('upload-session').click();
    }
  });
  public footerElemHashtagManagement: IFooterBarElement = new FooterbarElement({
    id: 'sessionManagement',
    iconClass: 'wrench',
    textClass: 'footerElementText',
    textName: 'component.name_management.session_management',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.sessionManagement',
    linkTarget: ['/', 'quiz', 'overview'],
  }, function (): void {

  });
  public footerElemFullscreen: IFooterBarElement = new FooterbarElement({
    id: 'fullscreen',
    iconClass: 'arrows-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.fullscreen',
    selectable: true,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.fullscreen',
    linkTarget: null,
    isActive: isPlatformBrowser(this.platformId) ? window.innerWidth === screen.width && window.innerHeight === screen.height : false,
  }, function (): void {
    this.isActive = !this.isActive;
    setFullScreen(this.isActive);
  });
  public footerElemHome: IFooterBarElement = new FooterbarElement({
    id: 'home',
    iconClass: 'home',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.home',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.home',
    linkTarget: ['/'],
  }, function (): void {

  });
  public footerElemAbout: IFooterBarElement = new FooterbarElement({
    id: 'about',
    iconClass: 'info-circle',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.info',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.about',
    linkTarget: ['/', 'info', environment.infoAboutTabEnabled ? 'about' : 'tos'],
  }, function (): void {

  });
  public footerElemQRCode: IFooterBarElement = new FooterbarElement({
    id: 'qr-code',
    iconClass: 'qrcode',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.qr_code',
    selectable: false,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.qr-code',
    linkTarget: null,
  }, function (): void {
  });
  public footerElemNicknames: IFooterBarElement = new FooterbarElement({
    id: 'nicknames',
    iconClass: 'users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.nicknames',
    selectable: false,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.nicknames',
    linkTarget: ['/', 'quiz', 'manager', 'nicknames'],
  }, function (): void {

  });
  public footerElemEditQuiz: IFooterBarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: 'edit',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit_quiz',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.edit-quiz',
    linkTarget: null,
  }, function (): void {

  });
  public footerElemResponseProgress: IFooterBarElement = new FooterbarElement({
    id: 'response-progress',
    iconClass: 'align-left',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_response_progress',
    selectable: true,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.response-progress',
    linkTarget: null,
  }, function (): void {

  });
  public footerElemConfidenceSlider: IFooterBarElement = new FooterbarElement({
    id: 'confidence-slider',
    iconClass: 'sliders-h',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_confidence_slider',
    selectable: true,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.confidence-slider',
    linkTarget: null,
  }, function (): void {

  });
  public footerElemBack: IFooterBarElement = new FooterbarElement({
    id: 'back',
    iconClass: 'undo',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.back',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.back',
    linkTarget: null,
  }, function (): void {
    console.log('footerElemBack: going back');
    history.back();
  });
  public footerElemStartQuiz: IFooterBarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'paper-plane',
    textClass: 'footerElementText',
    textName: 'component.lobby.start_quiz',
    selectable: true,
    introTranslate: 'region.footer.footer_bar.description.startQuiz',
    showIntro: false,
  }, function (): void {
  });
  public footerElemSaveQuiz: IFooterBarElement = new FooterbarElement({
    id: 'saveQuiz',
    iconClass: 'save',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.save_quiz',
    selectable: true,
    introTranslate: 'region.footer.footer_bar.description.saveQuiz',
    showIntro: false,
  }, function (): void {
  });
  public footerElemExport: IFooterBarElement = new FooterbarElement({
    id: 'exportQuiz',
    iconClass: 'download',
    textClass: 'footerElementText',
    textName: 'component.leaderboard.export',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.exportQuiz',
    linkTarget: null,
  }, function (): void {
  });

  /*
   * Currently unused since the server decides if it will cache the quiz contents
   */
  public footerElemSaveAssets: IFooterBarElement = new FooterbarElement({
    id: 'saveAssets',
    iconClass: 'cloud',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.cache_assets',
    selectable: true,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.saveAssets',
    linkTarget: null,
  }, function (): void {
  });

  public footerElemBlockRudeNicknames: IFooterBarElement = new FooterbarElement({
    id: 'blockRudeNicknames',
    iconClass: 'lock',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.block_rude_nicknames',
    selectable: true,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.blockRudeNicknames',
    linkTarget: null,
  }, function (): void {
  });
  public footerElemEnableCasLogin: IFooterBarElement = new FooterbarElement({
    id: 'enableCasLogin',
    iconClass: 'sign-in-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.enable_cas_login',
    selectable: true,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.enableCasLogin',
    linkTarget: null,
  }, function (): void {
  });
  public footerElemLeaderboard: IFooterBarElement = new FooterbarElement({
    id: 'leaderboard',
    iconClass: 'trophy',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.global_leaderboard',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.leaderboard',
    linkTarget: ['/', 'quiz', 'flow', 'leaderboard'],
  }, function (): void {
  });
  public footerElemMemberGroup: IFooterBarElement = new FooterbarElement({
    id: 'memberGroup',
    iconClass: 'users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.member_group',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.memberGroup',
    linkTarget: ['/', 'quiz', 'manager', 'memberGroup'],
  }, function (): void {
  });
  public footerElemLogin: IFooterBarElement = new FooterbarElement({
    id: 'login',
    iconClass: 'sign-in-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.login',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.login',
    linkTarget: ['/', 'login'],
  }, function (): void {
  });
  public footerElemLogout: IFooterBarElement = new FooterbarElement({
    id: 'logout',
    iconClass: 'sign-out-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.logout',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.logout',
    linkTarget: ['/', 'login'],
    queryParams: {
      logout: true,
    },
  }, () => {
    this.indexedDbService.isInitialized = false;
  });
  public footerElemEditI18n: IFooterBarElement = new FooterbarElement({
    id: 'edit-i18n',
    iconClass: 'language',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit-i18n',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.edit-i18n',
    linkTarget: ['/', 'i18n-manager'],
  }, function (): void {
  });
  public footerElemAdmin: IFooterBarElement = new FooterbarElement({
    id: 'admin',
    iconClass: 'unlock',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.admin',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.admin',
    linkTarget: ['/', 'admin'],
  }, function (): void {
  });

  private _footerElements: Array<IFooterBarElement> = [];

  get footerElements(): Array<IFooterBarElement> {
    return this._footerElements;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private indexedDbService: IndexedDbService) {
  }

  public replaceFooterElements(elements: Array<IFooterBarElement>): void {
    this.removeUnsupportedElements(elements);
    this._footerElements = elements;
  }

  private removeUnsupportedElements(elements: Array<IFooterBarElement>): void {
    const fullscreenIndex = elements.indexOf(this.footerElemFullscreen);
    if (fullscreenIndex > -1 && !Modernizr.fullscreen) {
      elements.splice(fullscreenIndex, 1);
    }

    const backIndex = elements.indexOf(this.footerElemBack);
    if (backIndex && history.length < 2) {
      elements.splice(backIndex, 1);
    }
  }
}
