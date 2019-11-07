import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answeroptions',
  templateUrl: './answeroptions.component.html',
  styleUrls: ['./answeroptions.component.scss'],
})
export class AnsweroptionsComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsComponent';

  public readonly questionType = QuestionType;

  private _question: AbstractQuestionEntity;

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  private _questionIndex: number;

  private readonly _destroy = new Subject();

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {
    this.headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.TYPE_REFERENCE = AnsweroptionsComponent.TYPE;
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  public ngOnInit(): void {
    const questionIndex$ = this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged());

    this.quizService.quizUpdateEmitter.pipe(switchMapTo(questionIndex$), takeUntil(this._destroy)).subscribe(questionIndex => {
      if (!this.quizService.quiz || isNaN(questionIndex)) {
        return;
      }

      this._questionIndex = questionIndex;
      this._question = this.quizService.quiz.questionList[this._questionIndex];
    });

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
