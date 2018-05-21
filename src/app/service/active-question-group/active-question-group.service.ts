import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ActiveQuestionGroupService {

  private _activeQuestionGroup: IQuestionGroup;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private settingsService: SettingsService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.sessionStorage.getItem('config.active_question_group')) {
        const serializedObject = window.sessionStorage.getItem('config.active_question_group');
        const parsedObject = JSON.parse(serializedObject);
        this.activeQuestionGroup = questionGroupReflection[parsedObject.TYPE](parsedObject);
      }
    }

  }

  public generatePrivateKey(length?: number): string {
    const arr = new Uint8Array((length || 40) / 2);

    if (isPlatformBrowser(this.platformId)) {
      window.crypto.getRandomValues(arr);
    }

    return Array.from(arr, this.dec2hex).join('');
  }

  public cleanUp(): void {
    this.activeQuestionGroup = null;
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('config.active_question_group');
    }
  }

  public persist(): void {
    this.persistForSession();
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.activeQuestionGroup.hashtag, JSON.stringify(this.activeQuestionGroup.serialize()));
      const questionList = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
      if (questionList.indexOf(this.activeQuestionGroup.hashtag) === -1) {
        questionList.push(this.activeQuestionGroup.hashtag);
        window.localStorage.setItem('config.owned_quizzes', JSON.stringify(questionList));
      }
    }
  }

  public updateFooterElementsState(): void {
    if (this.activeQuestionGroup) {
      this.footerBarService.footerElemEnableCasLogin.isActive = this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin;
      this.footerBarService.footerElemBlockRudeNicknames.isActive = this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks;

      if (window.localStorage.getItem('config.cache_assets') === 'true') {
        this.footerBarService.footerElemSaveAssets.isActive = true;
      }
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
        this.settingsService.serverSettings.cacheQuizAssets = newState;
        if (isPlatformBrowser(this.platformId)) {
          window.localStorage.setItem('config.cache_assets', `${newState}`);
        }
      };
    }
  }

  private dec2hex(dec): string {
    return ('0' + dec.toString(16)).substr(-2);
  }

  private persistForSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('config.active_question_group', JSON.stringify(this.activeQuestionGroup.serialize()));
    }
  }
}
