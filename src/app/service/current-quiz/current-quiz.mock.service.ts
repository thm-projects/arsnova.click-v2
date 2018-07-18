import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import { IQuestion, IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { Observable, of } from 'rxjs/index';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable()
export class CurrentQuizMockService {

  public quiz: IQuestionGroup;
  public questionIndex = 0;

  public isOwner = new Observable<boolean>(subscriber => subscriber.next(true));

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {
    this.quiz = new DefaultQuestionGroup({
      hashtag: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
      questionList: [
        new SingleChoiceQuestion({
          answerOptionList: [
            new DefaultAnswerOption({
              answerText: 'answer1',
              isCorrect: true,
            }), new DefaultAnswerOption({
              answerText: 'answer2',
              isCorrect: false,
            }),
          ],
        }),
      ],
    });
  }

  public currentQuestion(): IQuestion {
    return this.quiz.questionList[this.questionIndex];
  }

  public cacheQuiz(): Promise<any> {
    return new Promise(resolve => (
      resolve()
    ));
  }

  public close(): Promise<any> {
    return new Promise<any>(resolve => resolve());
  }

  public cleanUp(): Promise<any> {
    return new Promise<any>(resolve => resolve());
  }

  public toggleSetting(): Observable<void> {
    return of(null);
  }

  public persistToSessionStorage(): void {}

  public toggleSettingByName(): Observable<void> {
    return of(null);
  }

  public getVisibleQuestions(maxIndex?: number): Array<IQuestion> {
    return this.quiz.questionList.slice(0, maxIndex || this.questionIndex + 1);
  }

}
