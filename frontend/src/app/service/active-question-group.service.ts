import {Injectable} from '@angular/core';
import {questionGroupReflection} from '../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../lib/questions/interfaces';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from './settings.service';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {ConnectionService} from 'app/service/connection.service';

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
      this.persistForSession();
    }
  }

  private _activeQuestionGroup: IQuestionGroup;
  private _serverConfig: IServerConfig = {cacheQuizAssets: false};
  private _cacheAssets = false;

  constructor(
    private http: HttpClient,
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
}
