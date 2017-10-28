import {Injectable} from '@angular/core';
import {questionGroupReflection} from '../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../lib/questions/interfaces';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from './settings.service';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {ConnectionService} from 'app/service/connection.service';
import {FooterbarElement, FooterBarService} from './footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {QrCodeService} from 'app/service/qr-code.service';

export declare interface IServerConfig {
  cacheQuizAssets: boolean;
}

@Injectable()
export class ActiveQuestionGroupService {
  get cacheAssets(): boolean {
    return this._cacheAssets;
  }

  set cacheAssets(value: boolean) {
    this._cacheAssets = value;
  }
  get activeQuestionGroup(): IQuestionGroup {
    return this._activeQuestionGroup;
  }

  set activeQuestionGroup(value: IQuestionGroup) {
    this._activeQuestionGroup = value;
    if (value) {
      this.updateFooterElementsState();
      this.persistForSession();
    }
  }

  private _activeQuestionGroup: IQuestionGroup;
  private _serverConfig: IServerConfig = {cacheQuizAssets: false};
  private _cacheAssets = false;

  constructor(
    private qrCodeService: QrCodeService,
    private translateService: TranslateService,
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService) {
    if (window.sessionStorage.getItem('questionGroup')) {
      const serializedObject = window.sessionStorage.getItem('questionGroup');
      const parsedObject = JSON.parse(serializedObject);
      this.activeQuestionGroup = questionGroupReflection[parsedObject.TYPE](parsedObject);
    }
    this.connectionService.initConnection().then(() => {
      this.initCacheAssetsState();
    });
  }

  private initCacheAssetsState() {
    this.http.get(`${DefaultSettings.httpApiEndpoint}/`).subscribe((value: {serverConfig: IServerConfig}) => {
      this._serverConfig = value.serverConfig;
      this._cacheAssets = value.serverConfig.cacheQuizAssets;
    });
  }

  private dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }

  public generatePrivateKey(length?: number) {
    const arr = new Uint8Array((length || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, this.dec2hex).join('');
  }

  public cleanUp(): void {
    this.close();
    this.activeQuestionGroup = null;
  }

  public close(): void {
    window.sessionStorage.removeItem(`${this.activeQuestionGroup.hashtag}_nick`);
    this.http.request('delete', `${DefaultSettings.httpApiEndpoint}/quiz/active`, {
      body: {
        quizName: this.activeQuestionGroup.hashtag,
        privateKey: window.localStorage.getItem('config.private_key')
      }
    }).subscribe((response: IMessage) => {
      if (response.status !== 'STATUS:SUCCESS') {
        console.log(response);
      }
    });
  }

  persistForSession() {
    window.sessionStorage.setItem('questionGroup', JSON.stringify(this.activeQuestionGroup.serialize()));
  }

  persist() {
    this.persistForSession();
    window.localStorage.setItem(this.activeQuestionGroup.hashtag, JSON.stringify(this.activeQuestionGroup.serialize()));
    const questionList = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
    if (questionList.indexOf(this.activeQuestionGroup.hashtag) === -1) {
      questionList.push(this.activeQuestionGroup.hashtag);
      window.localStorage.setItem('config.owned_quizzes', JSON.stringify(questionList));
    }
    if (this._cacheAssets || this._serverConfig.cacheQuizAssets || DefaultSettings.defaultSettings.cacheQuizAssets) {
      this.http.post(`${DefaultSettings.httpLibEndpoint}/cache/quiz/assets`, {
        quiz: this.activeQuestionGroup.serialize()
      }).subscribe((response: IMessage) => {
        if (response.status !== 'STATUS:SUCCESSFULL') {
          console.log(response);
        }
      });
    }
  }


  public updateFooterElementsState() {
    if (this.activeQuestionGroup) {
      if (this.activeQuestionGroup.sessionConfig.readingConfirmationEnabled) {
        this.footerBarService.footerElemReadingConfirmation.isActive = true;
      }
      if (this.activeQuestionGroup.sessionConfig.showResponseProgress) {
        this.footerBarService.footerElemResponseProgress.isActive = true;
      }
      if (this.activeQuestionGroup.sessionConfig.confidenceSliderEnabled) {
        this.footerBarService.footerElemConfidenceSlider.isActive = true;
      }
      if (this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin) {
        this.footerBarService.footerElemEnableCasLogin.isActive = true;
      }
      if (this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks) {
        this.footerBarService.footerElemBlockRudeNicknames.isActive = true;
      }
      if (window.localStorage.getItem('config.cache_assets') === 'true') {
        this.footerBarService.footerElemSaveAssets.isActive = true;
      }
      this.footerBarService.footerElemQRCode.onClickCallback = () => {
        this.qrCodeService.toggleQrCode(this.activeQuestionGroup.hashtag);
      };
      this.footerBarService.footerElemEnableCasLogin.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemEnableCasLogin.isActive;
        this.footerBarService.footerElemEnableCasLogin.isActive = newState;
        this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin = newState;
        this.persist();
      };
      this.footerBarService.footerElemBlockRudeNicknames.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemBlockRudeNicknames.isActive;
        this.footerBarService.footerElemBlockRudeNicknames.isActive = newState;
        this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks = newState;
        this.persist();
      };
      this.footerBarService.footerElemSaveAssets.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemSaveAssets.isActive;
        this.footerBarService.footerElemSaveAssets.isActive = newState;
        this.cacheAssets = newState;
        window.localStorage.setItem('config.cache_assets', `${newState}`);
      };
      this.footerBarService.footerElemExport.onClickCallback = () => {
        const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this.activeQuestionGroup.hashtag}/${window.localStorage.getItem('config.private_key')}/${this.activeQuestionGroup.sessionConfig.theme}/${this.translateService.currentLang}`;
        window.open(link);
      };
    }
  }

  toggleSetting(elem: FooterbarElement) {
    let target: string = null;
    switch (elem) {
      case this.footerBarService.footerElemResponseProgress:
        target = 'showResponseProgress';
        break;
      case this.footerBarService.footerElemConfidenceSlider:
        target = 'confidenceSliderEnabled';
        break;
      case this.footerBarService.footerElemProductTour:
        target = null;
        break;
      case this.footerBarService.footerElemReadingConfirmation:
        target = 'readingConfirmationEnabled';
        break;
    }
    if (target) {
      this.activeQuestionGroup.sessionConfig[target] = !elem.isActive;
      elem.isActive = !elem.isActive;
      this.persistForSession();

      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/settings/update`, {
        quizName: this.activeQuestionGroup.hashtag,
        target: target,
        state: elem.isActive
      }).subscribe(
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
}
