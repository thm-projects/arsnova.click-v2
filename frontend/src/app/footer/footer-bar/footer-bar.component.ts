import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {Http, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

export class FooterbarElement {
  set linkTarget(value: string) {
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

  get linkTarget(): string {
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
  readonly _onClickCallback: Function;

  private _linkTarget: string;
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
}

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit, OnDestroy {
  get _footerElements(): Array<FooterbarElement> {
    return this.footerElements;
  }

  @Input() footerElements: Array<FooterbarElement> = [];

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
    selectable: true,
    showIntro: true,
    linkTarget: '/sound',
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
    linkTarget: '/session-management',
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
    linkTarget: '/about',
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
    linkTarget: '/quiz-manager/nicknames',
  }, function () {

  });
  static footerElemEditQuiz: FooterbarElement = new FooterbarElement({
    id: 'edit-quiz',
    iconClass: 'fa fa-pencil-square-o',
    textClass: 'footerElementText',
    textName: 'region.footer.footer_bar.edit_quiz',
    selectable: false,
    showIntro: false,
    linkTarget: '/quiz-manager',
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
    linkTarget: '/quiz-lobby',
  }, function () {

  });

  private _apiEndPoint = '/api/upload';
  private _routerSubscription: Subscription;

  constructor(private footerBarService: FooterBarService,
              private router: Router,
              private http: Http) {
  }

  ngOnInit() {
    this._routerSubscription = this.router.events.subscribe((val) => {
      if (val.hasOwnProperty('url')) {
        FooterBarComponent.footerElemTheme.linkTarget = val['url'].indexOf('lobby') > -1 ? '/quiz-theme' : '/themes';
      }
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
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
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions(headers);
    this.http.post(`${this._apiEndPoint}`, formData, options)
      .map(res => res.json())
      .subscribe(
        data => {
          console.log('success')
        },
        error => {
          console.log(error)
        }
      )
  }
}
