import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {Http, RequestOptions, RequestOptionsArgs} from '@angular/http';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {QrCodeService} from '../../service/qr-code.service';
import {DefaultSettings} from '../../service/settings.service';
import {TranslateService} from '@ngx-translate/core';
import {IMessage} from '../../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {ThemesService} from '../../service/themes.service';

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

  constructor({id, iconClass, textClass, textName, selectable, showIntro, linkTarget}: any, onClickCallback?: Function) {
    this._id = id;
    this._iconClass = iconClass;
    this._textClass = textClass;
    this._textName = textName;
    this._selectable = selectable;
    this._showIntro = showIntro;
    this._isActive = false;
    this._linkTarget = linkTarget;
    this._onClickCallback = onClickCallback;
  }

  public restoreClickCallback() {
    this._onClickCallback = this._restoreOnClickCallback;
  }
}

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit, OnDestroy {

  static footerElemTranslation: FooterbarElement = new FooterbarElement({
    id: 'translation',
    iconClass: 'fa fa-globe',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.languages',
    selectable: false,
    showIntro: false,
    linkTarget: '/languages'
  }, function () {
  });
  static footerElemSound: FooterbarElement = new FooterbarElement({
    id: 'sound',
    iconClass: 'fa fa-music',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.sound',
    selectable: false,
    showIntro: true,
    linkTarget: '/quiz/manager/sound',
  }, function () {

  });
  static footerElemReadingConfirmation: FooterbarElement = new FooterbarElement({
    id: 'reading-confirmation',
    iconClass: 'fa fa-eye',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.reading-confirmation',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  static footerElemTheme: FooterbarElement = new FooterbarElement({
    id: 'theme',
    iconClass: 'fa fa-apple',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.style',
    selectable: false,
    showIntro: false,
    linkTarget: '/themes',
  }, function () {

  });
  static footerElemImport: FooterbarElement = new FooterbarElement({
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
  static footerElemHashtagManagement: FooterbarElement = new FooterbarElement({
    id: 'sessionManagement',
    iconClass: 'fa fa-wrench',
    textClass: 'footerElementText',
    textName: 'component.hashtag_management.session_management',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/overview',
  }, function () {

  });
  static footerElemFullscreen: FooterbarElement = new FooterbarElement({
    id: 'fullscreen',
    iconClass: 'fa fa-arrows-alt',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.fullscreen',
    selectable: true,
    showIntro: false,
    linkTarget: null,
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
  static footerElemHome: FooterbarElement = new FooterbarElement({
    id: 'home',
    iconClass: 'fa fa-home',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.home',
    selectable: false,
    showIntro: false,
    linkTarget: '/',
  }, function () {

  });
  static footerElemAbout: FooterbarElement = new FooterbarElement({
    id: 'about',
    iconClass: 'fa fa-info-circle',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.info',
    selectable: false,
    showIntro: false,
    linkTarget: ['info', 'about'],
  }, function () {

  });
  static footerElemQRCode: FooterbarElement = new FooterbarElement({
    id: 'qr-code',
    iconClass: 'fa fa-qrcode',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.qr_code',
    selectable: false,
    showIntro: true,
    linkTarget: null,
  }, function () {
  });
  static footerElemNicknames: FooterbarElement = new FooterbarElement({
    id: 'nicknames',
    iconClass: 'fa fa-users',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.nicknames',
    selectable: true,
    showIntro: true,
    linkTarget: '/quiz/manager/nicknames',
  }, function () {

  });
  static footerElemEditQuiz: FooterbarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: 'fa fa-pencil-square-o',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit_quiz',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz/manager',
  }, function () {

  });
  static footerElemProductTour: FooterbarElement = new FooterbarElement({
    id: 'product-tour',
    iconClass: 'fa fa-flag',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_product_tour',
    selectable: true,
    showIntro: false,
    linkTarget: null,
  }, function () {

  });
  static footerElemResponseProgress: FooterbarElement = new FooterbarElement({
    id: 'response-progress',
    iconClass: 'fa fa-align-left',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_response_progress',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  static footerElemConfidenceSlider: FooterbarElement = new FooterbarElement({
    id: 'confidence-slider',
    iconClass: 'fa fa-sliders',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.show_confidence_slider',
    selectable: true,
    showIntro: true,
    linkTarget: null,
  }, function () {

  });
  static footerElemBack: FooterbarElement = new FooterbarElement({
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
  static footerElemStartQuiz: FooterbarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fa fa-paper-plane',
    textClass: 'footerElementText',
    textName: 'component.lobby.start_quiz',
    selectable: true,
    showIntro: false,
  }, function () {
  });
  static footerElemExport: FooterbarElement = new FooterbarElement({
    id: 'startQuiz',
    iconClass: 'fa fa-download',
    textClass: 'footerElementText',
    textName: 'component.leaderboard.export',
    selectable: false,
    showIntro: false,
    linkTarget: null
  }, function () {
  });

  get _footerElements(): Array<FooterbarElement> {
    return this.footerElements;
  }

  @Input() footerElements: Array<FooterbarElement> = [];

  private _routerSubscription: Subscription;

  constructor(
    private footerBarService: FooterBarService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private router: Router,
    private http: Http,
    private translateService: TranslateService,
    private themesService: ThemesService,
    private qrCodeService: QrCodeService) {

    if (this.activeQuestionGroupService.activeQuestionGroup) {
      if (this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.readingConfirmationEnabled) {
        FooterBarComponent.footerElemReadingConfirmation.isActive = true;
      }
      if (this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.showResponseProgress) {
        FooterBarComponent.footerElemResponseProgress.isActive = true;
      }
      if (this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.confidenceSliderEnabled) {
        FooterBarComponent.footerElemConfidenceSlider.isActive = true;
      }
      FooterBarComponent.footerElemQRCode.onClickCallback = () => {
        qrCodeService.toggleQrCode();
      };
      FooterBarComponent.footerElemExport.onClickCallback = () => {
        const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this.activeQuestionGroupService.activeQuestionGroup.hashtag}/${window.localStorage.getItem('privateKey')}/${themesService.currentTheme}/${translateService.currentLang}`;
        window.open(link);
      };
    }
  }

  ngOnInit() {
    this._routerSubscription = this.router.events.subscribe((val) => {
      if (val.hasOwnProperty('url')) {
        FooterBarComponent.footerElemTheme.linkTarget = val['url'].indexOf('lobby') > -1 ? '/quiz/flow/theme' : '/themes';
      }
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

  getLinkTarget(elem: FooterbarElement): void {
    return typeof elem.linkTarget === 'function' ? elem.linkTarget(elem) : elem.linkTarget;
  }

  toggleSetting(elem: FooterbarElement) {
    let target: string = null;
    switch (elem) {
      case FooterBarComponent.footerElemResponseProgress:
        target = 'showResponseProgress';
        break;
      case FooterBarComponent.footerElemConfidenceSlider:
        target = 'confidenceSliderEnabled';
        break;
      case FooterBarComponent.footerElemProductTour:
        target = null;
        break;
      case FooterBarComponent.footerElemReadingConfirmation:
        target = 'readingConfirmationEnabled';
        break;
    }
    if (target) {
      this.activeQuestionGroupService.activeQuestionGroup.sessionConfig[target] = !elem.isActive;
      elem.isActive = !elem.isActive;
      this.activeQuestionGroupService.persistForSession();

      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/settings/update`, {
        quizName: this.activeQuestionGroupService.activeQuestionGroup.hashtag,
        target: target,
        state: elem.isActive
      }).map(res => res.json()).subscribe(
        (data: IMessage) => {
          if (data.status !== 'STATUS:SUCCESS') {
            console.log(data);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public fileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const formData: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      const file: File = fileList[i];
      formData.append('uploadFile', file, file.name);
    }
    formData.append('privateKey', window.localStorage.getItem('privateKey'));
    const options = new RequestOptions();
    options.headers.append('Content-Type', 'multipart/form-data');
    options.headers.append('Accept', 'application/json');
    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/upload`, formData, options)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('success');
          },
          error => {
            console.log(error);
          }
        );
  }
}
