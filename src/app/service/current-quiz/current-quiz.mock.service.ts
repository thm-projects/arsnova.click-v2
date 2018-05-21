import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { DefaultSettings } from '../../../lib/default.settings';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { CurrentQuizService } from './current-quiz.service';

@Injectable()
export class CurrentQuizMockService extends CurrentQuizService {

  public quiz: IQuestionGroup;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _http: HttpClient,
    private _translateService: TranslateService,
    private _footerBarService: FooterBarService,
    private _settingsService: SettingsService,
    private _connectionService: ConnectionService,
  ) {
    super(_platformId, _http, _translateService, _footerBarService, _settingsService, _connectionService);
    this.quiz = new DefaultQuestionGroup({
      hashtag: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
      questionList: [
        new SingleChoiceQuestion({
          answerOptionList: [
            new DefaultAnswerOption({ answerText: 'answer1', isCorrect: true }),
            new DefaultAnswerOption({ answerText: 'answer2', isCorrect: false }),
          ],
        }),
      ],
    });
  }
}
