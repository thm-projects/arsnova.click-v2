import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss'],
})
export class QuizManagerDetailsOverviewComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizManagerDetailsOverviewComponent';

  private _question: AbstractQuestionEntity;

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  private readonly _destroy = new Subject();
  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
    private trackingService: TrackingService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
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
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public trackDetailsTarget(link: string): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerDetailsOverviewComponent.TYPE,
      label: link,
    });
  }
}
