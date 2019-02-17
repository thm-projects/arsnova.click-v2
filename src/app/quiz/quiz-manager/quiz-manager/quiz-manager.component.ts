import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../lib/available-question-types';
import { DefaultAnswerEntity } from '../../../../lib/entities/answer/DefaultAnswerEntity';
import { ABCDSingleChoiceQuestionEntity } from '../../../../lib/entities/question/ABCDSingleChoiceQuestionEntity';
import { TrueFalseSingleChoiceQuestionEntity } from '../../../../lib/entities/question/TrueFalseSingleChoiceQuestionEntity';
import { YesNoSingleChoiceQuestionEntity } from '../../../../lib/entities/question/YesNoSingleChoiceQuestionEntity';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { FooterbarElement } from '../../../../lib/footerbar-element/footerbar-element';
import { getQuestionForType } from '../../../../lib/QuizValidator';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { TrackingService } from '../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuizManagerComponent implements OnDestroy {
  public static TYPE = 'QuizManagerComponent';

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private translateService: TranslateService,
    public quizService: QuizService,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private connectionService: ConnectionService,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.TYPE_REFERENCE = QuizManagerComponent.TYPE;

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemMemberGroup,
      this.footerBarService.footerElemSound,
    ]);

    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(() => {
      console.log('start quiz button: isActive', this.quizService.isValid(), this.connectionService.serverAvailable);
      this.footerBarService.footerElemStartQuiz.isActive = this.quizService.isValid() && this.connectionService.serverAvailable;
    }));
    this.quizService.loadDataToEdit(sessionStorage.getItem('currentQuizName'));

    this.footerBarService.footerElemStartQuiz.onClickCallback = (self: FooterbarElement) => {
      if (!self.isActive) {
        return;
      }
      this.quizApiService.setQuiz(this.quizService.quiz).subscribe(updatedQuiz => {
        sessionStorage.setItem('token', updatedQuiz.adminToken);
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      });
    };
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();
  }

  public addQuestion(id: QuestionType): void {
    let question;

    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `add-question`,
    });
    switch (id) {
      case QuestionType.TrueFalseSingleChoiceQuestion:
        question = new TrueFalseSingleChoiceQuestionEntity({
          answerOptionList: [
            new DefaultAnswerEntity({
              answerText: this.translateService.instant('global.true'),
              isCorrect: false,
            }), new DefaultAnswerEntity({
              answerText: this.translateService.instant('global.false'),
              isCorrect: false,
            }),
          ],
        });
        break;
      case QuestionType.YesNoSingleChoiceQuestion:
        question = new YesNoSingleChoiceQuestionEntity({
          answerOptionList: [
            new DefaultAnswerEntity({
              answerText: this.translateService.instant('global.yes'),
              isCorrect: false,
            }), new DefaultAnswerEntity({
              answerText: this.translateService.instant('global.no'),
              isCorrect: false,
            }),
          ],
        });
        break;
      case QuestionType.ABCDSingleChoiceQuestion:
        question = new ABCDSingleChoiceQuestionEntity({
          answerOptionList: [
            new DefaultAnswerEntity({
              answerText: 'A',
              isCorrect: false,
            }), new DefaultAnswerEntity({
              answerText: 'B',
              isCorrect: false,
            }), new DefaultAnswerEntity({
              answerText: 'C',
              isCorrect: false,
            }), new DefaultAnswerEntity({
              answerText: 'D',
              isCorrect: false,
            }),
          ],
        });
        break;
      default:
        question = getQuestionForType(id);
    }
    this.quizService.quiz.addQuestion(question);
    this.footerBarService.footerElemStartQuiz.isActive = this.quizService.isValid();
    this.quizService.persist();
  }

  public moveQuestionUp(id: number): void {
    if (!id) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-up`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, id - 1);
    this.quizService.persist();
  }

  public moveQuestionDown(id: number): void {
    if (id === this.quizService.quiz.questionList.length - 1) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-down`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, id + 1);
    this.quizService.persist();
  }

  public deleteQuestion(id: number): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `delete-question`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.footerBarService.footerElemStartQuiz.isActive = this.quizService.isValid();
    this.quizService.persist();
  }

  public trackEditQuestion(): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `edit-question`,
    });
  }
}
