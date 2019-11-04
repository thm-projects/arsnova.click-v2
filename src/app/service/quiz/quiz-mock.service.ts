import { Observable, of, ReplaySubject } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { FreeTextAnswerEntity } from '../../../lib/entities/answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { FreeTextQuestionEntity } from '../../../lib/entities/question/FreeTextQuestionEntity';
import { RangedQuestionEntity } from '../../../lib/entities/question/RangedQuestionEntity';
import { SingleChoiceQuestionEntity } from '../../../lib/entities/question/SingleChoiceQuestionEntity';
import { SurveyQuestionEntity } from '../../../lib/entities/question/SurveyQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';

export class QuizMockService {
  public quiz: QuizEntity;

  public quizUpdateEmitter = new ReplaySubject(1);

  public isOwner = true;

  constructor() {
    this.quiz = new QuizEntity({
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

  public currentQuestion(): AbstractQuestionEntity {
    return this.quiz.questionList[0];
  }

  public getVisibleQuestions(): Array<AbstractQuestionEntity> {
    return [this.currentQuestion()];
  }

  public cleanUp(): void {}

  public persist(): void {}

  public loadData(): Observable<QuizEntity> {
    return of(this.quiz);
  }

  public loadDataToEdit(val: string): void {}

  public generatePrivateKey(): string {
    return 'privateKey';
  }

  public toggleSetting(val: IFooterBarElement): void {}

  public removeSelectedNickByName(val: string): void {}

  public addSelectedNick(val: string): void {}

  public toggleSelectedNick(val: string): void {}

  public isValid(): boolean {
    return true;
  }

  public stopEditMode(): void {}

  public loadDataToPlay(val: IFooterBarElement): Promise<void> {
    return new Promise<void>(resolve => resolve());
  }
}
