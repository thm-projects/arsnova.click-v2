import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../../lib/AutoUnsubscribe';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../../lib/available-question-types';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { getQuestionForType } from '../../../../../lib/QuizValidator';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuestiontypeComponent {
  public static TYPE = 'QuestiontypeComponent';

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  private _question: AbstractQuestionEntity;
  private _questionIndex: number;
  private _questionType: string;

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestiontypeComponent.TYPE;

    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemNicknames,
    ]);

    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._subscriptions.push(this.route.params.subscribe(params => {
        this._questionIndex = +params['questionIndex'];
        if (this.quizService.quiz) {
          this._question = this.quizService.quiz.questionList[this._questionIndex];
        }
        this._questionType = this._question.TYPE;
      }));
    }));

    this.quizService.loadDataToEdit(sessionStorage.getItem('currentQuizName'));
  }

  public isActiveQuestionType(type: string): boolean {
    return type === this._questionType;
  }

  public morphToQuestionType(type: QuestionType): void {
    this._question = getQuestionForType(type, this._question);
    this._questionType = type;
    this.quizService.quiz.removeQuestion(this._questionIndex);
    this.quizService.quiz.addQuestion(this._question, this._questionIndex);
    this.quizService.persist();
  }
}
