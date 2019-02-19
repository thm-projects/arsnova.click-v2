import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../../lib/AutoUnsubscribe';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../../lib/enums/enums';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answeroptions',
  templateUrl: './answeroptions.component.html',
  styleUrls: ['./answeroptions.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class AnsweroptionsComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsComponent';

  public readonly questionType = QuestionType;

  private _question: AbstractQuestionEntity;

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  private _questionIndex: number;

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = AnsweroptionsComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemNicknames,
    ]);
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._subscriptions.push(this.route.params.subscribe(params => {
        this._questionIndex = +params['questionIndex'];
        if (this.quizService.quiz) {
          this._question = this.quizService.quiz.questionList[this._questionIndex];
        }
      }));
    }));

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnDestroy(): void {}
}
