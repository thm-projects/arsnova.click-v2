import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/dist/answeroptions/answeroption_default';
import { IQuestion, IQuestionGroup } from 'arsnova-click-v2-types/dist/questions/interfaces';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/dist/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/dist/questions/questiongroup_default';
import { questionGroupReflection } from 'arsnova-click-v2-types/dist/questions/questionGroup_reflection';
import { SessionConfiguration } from 'arsnova-click-v2-types/dist/session_configuration/session_config';
import { Observable, of } from 'rxjs/index';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable()
export class CurrentQuizMockService {
  public questionIndex = 0;
  public isOwner = new Observable<boolean>(subscriber => subscriber.next(true));

  private _quiz: IQuestionGroup;

  get quiz(): IQuestionGroup {
    const quiz = JSON.parse(JSON.stringify(this._quiz.serialize()));
    return questionGroupReflection[quiz.TYPE](quiz);
  }

  set quiz(value: IQuestionGroup) {
    this._quiz = value;
  }

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {
    this._quiz = new DefaultQuestionGroup({
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
    return this._quiz.questionList[this.questionIndex];
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
    return this._quiz.questionList.slice(0, maxIndex || this.questionIndex + 1);
  }

}
