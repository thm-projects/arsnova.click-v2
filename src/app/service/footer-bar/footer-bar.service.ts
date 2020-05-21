import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { filter, switchMapTo } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefaultSettings } from '../../lib/default.settings';
import { StorageKey } from '../../lib/enums/enums';
import { StatusProtocol } from '../../lib/enums/Message';
import { QuizState } from '../../lib/enums/QuizState';
import { FooterbarElement } from '../../lib/footerbar-element/footerbar-element';
import { IFooterBarElement } from '../../lib/footerbar-element/interfaces';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { AttendeeService } from '../attendee/attendee.service';
import { QuizService } from '../quiz/quiz.service';
import { ThemesService } from '../themes/themes.service';
import { TwitterService } from '../twitter/twitter.service';
import { UserService } from '../user/user.service';

declare class Modernizr {
  public static fullscreen: boolean;
}

interface IFsDocument extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  mozCancelFullScreen?: () => void;
  msExitFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
}

export function isFullScreen(): boolean {
  const fsDoc = <IFsDocument>document;

  return Boolean(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.webkitFullscreenElement || fsDoc.msFullscreenElement);
}

interface IFsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

export function toggleFullScreen(): void {
  const fsDoc = <IFsDocument>document;

  if (!isFullScreen()) {
    const fsDocElem = <IFsDocumentElement>document.documentElement;

    if (fsDocElem.requestFullscreen) {
      (
        fsDocElem as any
      ).requestFullscreen();
    } else if (fsDocElem.msRequestFullscreen) {
      fsDocElem.msRequestFullscreen();
    } else if (fsDocElem.mozRequestFullScreen) {
      fsDocElem.mozRequestFullScreen();
    } else if (fsDocElem.webkitRequestFullscreen) {
      fsDocElem.webkitRequestFullscreen();
    }
  } else if (fsDoc.exitFullscreen) {
    fsDoc.exitFullscreen();
  } else if (fsDoc.msExitFullscreen) {
    fsDoc.msExitFullscreen();
  } else if (fsDoc.mozCancelFullScreen) {
    fsDoc.mozCancelFullScreen();
  } else if (fsDoc.webkitExitFullscreen) {
    fsDoc.webkitExitFullscreen();
  }
}

export function setFullScreen(full: boolean): void {
  if (full !== isFullScreen()) {
    toggleFullScreen();
  }
}

@Injectable({
  providedIn: 'root',
})
export class FooterBarService {
  private _footerElements: Array<IFooterBarElement> = [];
  private _connectionState: RxStompState;

  public TYPE_REFERENCE: string;
  public footerElemQuizpool: IFooterBarElement = new FooterbarElement({
    id: 'quizpool',
    iconLayer: [
      {
        classes: ['fas', 'question'],
        transform: 'shrink-3' as any,
      },
      {
        classes: ['fas', 'question'],
        transform: 'shrink-6 right-7 rotate-50' as any,
      },
      {
        classes: ['fas', 'question'],
        transform: 'shrink-5 bottom-5 left-7 rotate--30' as any,
      },
    ],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.questionpool',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.questionpool',
    linkTarget: ['/', 'quiz', 'pool'],
  }, function (): void {
  });
  public footerElemTranslation: IFooterBarElement = new FooterbarElement({
    id: 'translation',
    iconClass: ['fas', 'globe'],
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
    iconClass: ['fas', 'music'],
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
    iconClass: ['fas', 'eye'],
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
    iconClass: ['fas', 'apple-alt'],
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
    iconClass: ['fas', 'upload'],
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
    iconClass: ['fas', 'wrench'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.my-quizzes',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.sessionManagement',
    linkTarget: ['/', 'quiz', 'overview'],
  }, function (): void {

  });
  public footerElemFullscreen: IFooterBarElement = new FooterbarElement({
    id: 'fullscreen',
    iconClass: ['fas', 'arrows-alt'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.fullscreen',
    selectable: true,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.fullscreen',
    linkTarget: null,
    isActive: isPlatformBrowser(this.platformId) ? window.outerWidth === screen.width && window.outerHeight === screen.height : false,
  }, self => {
    self.isActive = !self.isActive;
    setFullScreen(self.isActive);
  });
  public footerElemHome: IFooterBarElement = new FooterbarElement({
    id: 'home',
    iconClass: ['fas', 'home'],
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
    iconClass: ['fas', 'info-circle'],
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
    iconClass: ['fas', 'qrcode'],
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
    iconClass: ['fas', 'users'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.nicknames',
    selectable: false,
    showIntro: true,
    introTranslate: 'region.footer.footer_bar.description.nicknames',
    linkTarget: (self) => {
      if (!self.isActive) {
        return;
      }

      return ['/', 'quiz', 'manager', 'nicknames'];
    },
  }, function (): void {

  });
  public footerElemEditQuiz: IFooterBarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: ['fas', 'edit'],
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
    iconClass: ['fas', 'align-left'],
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
    iconClass: ['fas', 'sliders-h'],
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
    iconClass: ['fas', 'undo'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.back',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.back',
    linkTarget: null,
  }, () => {
    history.back();
  });
  public footerElemStartQuiz: IFooterBarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: ['fas', 'paper-plane'],
    textClass: 'footerElementText',
    textName: 'component.lobby.start_quiz',
    selectable: true,
    introTranslate: 'region.footer.footer_bar.description.startQuiz',
    showIntro: false,
  }, function (): void {
  });
  public footerElemSaveQuiz: IFooterBarElement = new FooterbarElement({
    id: 'saveQuiz',
    iconClass: ['fas', 'save'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.save_quiz',
    selectable: true,
    introTranslate: 'region.footer.footer_bar.description.saveQuiz',
    showIntro: false,
  }, function (): void {
  });
  public footerElemExport: IFooterBarElement = new FooterbarElement({
    id: 'exportQuiz',
    iconClass: ['fas', 'download'],
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
    iconClass: ['fas', 'cloud'],
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
    iconClass: ['fas', 'lock'],
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
    iconClass: ['fas', 'sign-in-alt'],
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
    iconClass: ['fas', 'trophy'],
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
    iconClass: ['fas', 'users'],
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
    iconClass: ['fas', 'sign-in-alt'],
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
    iconClass: ['fas', 'sign-out-alt'],
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
  });
  public footerElemEditI18n: IFooterBarElement = new FooterbarElement({
    id: 'edit-i18n',
    iconClass: ['fas', 'language'],
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
    iconClass: ['fas', 'unlock'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.admin',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.description.admin',
    linkTarget: ['/', 'admin'],
  }, function (): void {
  });
  public footerElemShowToken: IFooterBarElement = new FooterbarElement({
    id: 'showToken',
    iconClass: ['fas', 'key'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.showToken',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.showToken',
    linkTarget: null,
  }, function (): void {
  });
  public footerElemTwitterTweet: IFooterBarElement = new FooterbarElement({
    id: 'twitter-tweet',
    iconClass: ['fab', 'twitter'],
    iconColorClass: 'color-twitter',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.twitter.tweet',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.twitter.tweet',
    linkTarget: null,
  }, () => {
    this.twitterService.tweet();
  });
  public footerElemAudio: IFooterBarElement = new FooterbarElement({
    id: 'audio',
    iconClass: ['fas', 'volume-up'],
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.audio',
    selectable: false,
    showIntro: false,
    introTranslate: 'region.footer.footer_bar.audio',
    linkTarget: null,
  }, self => {
    this.quizService.toggleAudioPlay();
    if (this.quizService.playAudio) {
      self.iconClass = ['fas', 'volume-up'];
    } else {
      self.iconClass = ['fas', 'volume-mute'];
    }
  });

  get footerElements(): Array<IFooterBarElement> {
    return this._footerElements;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private rxStompService: RxStompService,
    private quizService: QuizService,
    private attendeeService: AttendeeService,
    private quizApiService: QuizApiService,
    private translateService: TranslateService,
    private themesService: ThemesService,
    private twitterService: TwitterService,
  ) {

    this.quizService.quizUpdateEmitter.pipe(filter(quiz => !!quiz && [QuizState.Active, QuizState.Running].includes(quiz.state)),
      switchMapTo(this.attendeeService.attendeeAmount), filter(attendeeAmount => attendeeAmount > 0),
      switchMapTo(this.rxStompService.connectionState$)).subscribe(value => {
      this._connectionState = value;
      this.updateFooterElementsState();
    });

    this.quizService.quizUpdateEmitter.pipe(filter(quiz => !!quiz && ![QuizState.Active, QuizState.Running].includes(quiz.state)),
      switchMapTo(this.rxStompService.connectionState$)).subscribe(value => {
      this._connectionState = value;
      this.updateFooterElementsState();
    });
  }

  public replaceFooterElements(elements: Array<IFooterBarElement>): void {
    this.removeUnsupportedElements(elements);
    this._footerElements = elements;
  }

  public toggleSetting(elem: IFooterBarElement): void {
    let target: string = null;
    switch (elem) {
      case this.footerElemResponseProgress:
        target = 'showResponseProgress';
        break;
      case this.footerElemConfidenceSlider:
        target = 'confidenceSliderEnabled';
        break;
      case this.footerElemReadingConfirmation:
        target = 'readingConfirmationEnabled';
        break;
    }
    if (target) {
      this.quizService.quiz.sessionConfig[target] = !elem.isActive;
      elem.isActive = !elem.isActive;
      this.toggleSettingByName(target, elem.isActive);
    }
  }

  private toggleSettingByName(target: string, state: boolean | string): void {
    this.quizApiService.postQuizSettingsUpdate(this.quizService.quiz, {
      target: target,
      state: state,
    }).subscribe(data => {
      if (data.status !== StatusProtocol.Success) {
        console.log('FooterBarService: PostQuizSettingsUpdate failed', data);
      }
    }, error => {
      console.log('FooterBarService: PostQuizSettingsUpdate failed', error);
    });
  }

  private removeUnsupportedElements(elements: Array<IFooterBarElement>): void {
    const fullscreenIndex = elements.findIndex(elem => elem.id === this.footerElemFullscreen.id);
    if (fullscreenIndex > -1 && isPlatformBrowser(this.platformId) && !Modernizr.fullscreen) {
      elements.splice(fullscreenIndex, 1);
    }

    const backIndex = elements.findIndex(elem => elem.id === this.footerElemBack.id);
    if (backIndex > -1 && isPlatformBrowser(this.platformId) && history.length < 2) {
      elements.splice(backIndex, 1);
    }
  }

  private updateFooterElementsState(): void {
    if (!this.quizService.quiz) {
      return;
    }

    this.footerElemReadingConfirmation.isActive = !!this.quizService.quiz.sessionConfig.readingConfirmationEnabled;
    this.footerElemConfidenceSlider.isActive = !!this.quizService.quiz.sessionConfig.confidenceSliderEnabled;
    this.footerElemStartQuiz.isActive = this.quizService.isValid() && this._connectionState === RxStompState.OPEN;
    this.footerElemNicknames.isActive = this._connectionState === RxStompState.OPEN;

    this.footerElemExport.restoreClickCallback();
    this.footerElemExport.onClickCallback = async () => {
      const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${encodeURIComponent(this.quizService.quiz.name)}/${encodeURIComponent(
        sessionStorage.getItem(StorageKey.PrivateKey))}/${encodeURIComponent(this.themesService.currentTheme)}/${encodeURIComponent(
        this.translateService.currentLang)}`;
      window.open(link);
    };

    this.footerElemEnableCasLogin.restoreClickCallback();
    this.footerElemEnableCasLogin.isActive = this.quizService.quiz.sessionConfig.nicks.restrictToCasLogin;
    this.footerElemEnableCasLogin.onClickCallback = () => {
      const newState = !this.footerElemEnableCasLogin.isActive;
      this.footerElemEnableCasLogin.isActive = newState;
      this.quizService.quiz.sessionConfig.nicks.restrictToCasLogin = newState;
      this.quizService.persist();
    };

    this.footerElemBlockRudeNicknames.restoreClickCallback();
    this.footerElemBlockRudeNicknames.isActive = this.quizService.quiz.sessionConfig.nicks.blockIllegalNicks;
    this.footerElemBlockRudeNicknames.onClickCallback = () => {
      const newState = !this.footerElemBlockRudeNicknames.isActive;
      this.footerElemBlockRudeNicknames.isActive = newState;
      this.quizService.quiz.sessionConfig.nicks.blockIllegalNicks = newState;
      this.quizService.persist();
    };
  }
}
