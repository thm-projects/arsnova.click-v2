import { Observable, of } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { FreeTextAnswerEntity } from '../../../lib/entities/answer/FreetextAnwerEntity';
import { FreeTextQuestionEntity } from '../../../lib/entities/question/FreeTextQuestionEntity';
import { RangedQuestionEntity } from '../../../lib/entities/question/RangedQuestionEntity';
import { SingleChoiceQuestionEntity } from '../../../lib/entities/question/SingleChoiceQuestionEntity';
import { SurveyQuestionEntity } from '../../../lib/entities/question/SurveyQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';

export class QuizMockService {
  public activeQuestionGroup: QuizEntity;

  constructor() {
    this.activeQuestionGroup = new QuizEntity({
      name: 'test',
      sessionConfig: new SessionConfigurationEntity(DefaultSettings.defaultQuizSettings.sessionConfig),
      questionList: [
        new SingleChoiceQuestionEntity({}), new FreeTextQuestionEntity({
          questionText: '',
          timer: 0,
          answerOptionList: [
            new FreeTextAnswerEntity({
              answerText: '',
              configCaseSensitive: true,
              configTrimWhitespaces: true,
              configUseKeywords: true,
              configUsePunctuation: true,
            }),
          ],
        }), new RangedQuestionEntity({
          questionText: '',
          timer: 0,
          correctValue: 20,
          rangeMin: 10,
          rangeMax: 30,
        }), new SurveyQuestionEntity({
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

  public loadData(): Observable<QuizEntity> {
    return of(this.activeQuestionGroup);
  }

  public generatePrivateKey(): string {
    return 'privateKey';
  }
}
