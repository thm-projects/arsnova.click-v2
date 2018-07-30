import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { Observable, of } from 'rxjs';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { StorageService } from '../storage/storage.service';

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
    private storageService: StorageService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  public generatePrivateKey(length?: number): string {
    const arr = new Uint8Array((
                                 length || 40
                               ) / 2);

    if (isPlatformBrowser(this.platformId)) {
      window.crypto.getRandomValues(arr);
    }

    return Array.from(arr, this.dec2hex).join('');
  }

  public cleanUp(): void {
    this._activeQuestionGroup = null;
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.delete(DB_TABLE.CONFIG, STORAGE_KEY.ACTIVE_QUESTION_GROUP).subscribe();
    }
  }

  public async persist(): Promise<void> {
    this.persistForSession();
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.create(DB_TABLE.QUIZ, this.activeQuestionGroup.hashtag, this.activeQuestionGroup.serialize()).subscribe();
    }
  }

  public updateFooterElementsState(): void {
    if (this.activeQuestionGroup) {
      this.footerBarService.footerElemEnableCasLogin.isActive = this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin;
      this.footerBarService.footerElemBlockRudeNicknames.isActive = this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks;

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
    }
  }

  public loadData(): Observable<IQuestionGroup> {
    if (this._activeQuestionGroup) {
      return of(this._activeQuestionGroup);
    }

    const data = this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.ACTIVE_QUESTION_GROUP);
    data.subscribe(parsedObject => {
      if (parsedObject) {
        this._activeQuestionGroup = questionGroupReflection[parsedObject.TYPE](parsedObject);
      }
    });
    return data;
  }

  private dec2hex(dec): string {
    return (
      '0' + dec.toString(16)
    ).substr(-2);
  }

  private persistForSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.ACTIVE_QUESTION_GROUP, this.activeQuestionGroup.serialize()).subscribe();
    }
  }
}
