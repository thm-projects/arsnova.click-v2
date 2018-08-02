import { FreeTextAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_freetext';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { FreeTextQuestion } from 'arsnova-click-v2-types/src/questions/question_freetext';
import { RangedQuestion } from 'arsnova-click-v2-types/src/questions/question_ranged';
import { SurveyQuestion } from 'arsnova-click-v2-types/src/questions/question_survey';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { Observable, of } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';

export class ActiveQuestionGroupMockService {
  public activeQuestionGroup: IQuestionGroup;

  constructor() {
    this.activeQuestionGroup = new DefaultQuestionGroup({
      hashtag: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
      questionList: [
        new SingleChoiceQuestion({}), new FreeTextQuestion({
          questionText: '',
          timer: 0,
          answerOptionList: [
            new FreeTextAnswerOption({
              answerText: '',
              configCaseSensitive: true,
              configTrimWhitespaces: true,
              configUseKeywords: true,
              configUsePunctuation: true,
            }),
          ],
        }), new RangedQuestion({
          questionText: '',
          timer: 0,
          correctValue: 20,
          rangeMin: 10,
          rangeMax: 30,
        }), new SurveyQuestion({
          questionText: '',
          timer: 0,
          displayAnswerText: true,
          answerOptionList: [],
          showOneAnswerPerRow: true,
          multipleSelectionEnabled: false,
        }),
      ],
    });
  }

  public cleanUp(): void {}

  public persist(): void {}

  public loadData(): Observable<IQuestionGroup> {
    return of(this.activeQuestionGroup);
  }

  public generatePrivateKey(): string {
    return 'privateKey';
  }
}
