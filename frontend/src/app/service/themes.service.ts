import {Injectable, Renderer2} from '@angular/core';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {DefaultSettings} from './settings.service';
import {ITheme} from '../../lib/common.interfaces';
import {HttpClient} from '@angular/common/http';
import {IMessage} from '../quiz-flow/quiz-lobby/quiz-lobby.component';

@Injectable()
export class ThemesService {
  private previewThemeBackup = '';

  get themes(): Array<Object> {
    return this._themes;
  }

  private _themes: Array<ITheme> = [];

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private http: HttpClient) {
    if (!window.localStorage.getItem('defaultTheme')) {
      window.localStorage.setItem('defaultTheme', DefaultSettings.defaultSettings.theme);
    }
    this.updateCurrentlyUsedTheme();
    http.get(`${DefaultSettings.httpApiEndpoint}/themes`)
      .subscribe(
        (data: IMessage) => {
          this._themes = data.payload;
        },
        error => {
          console.log(error);
        }
      );
  }

  updateCurrentlyUsedTheme() {
    let usedTheme = window.localStorage.getItem('defaultTheme');
    if (this.activeQuestionGroupService.activeQuestionGroup && this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme) {
      usedTheme = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme;
    }
    if (document.body.className) {
      document.body.classList.remove(document.body.className);
    }
    document.body.className = usedTheme;
  }

}
