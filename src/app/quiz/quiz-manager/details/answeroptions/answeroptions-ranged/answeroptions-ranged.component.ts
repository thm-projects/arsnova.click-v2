import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HotkeysService } from 'angular2-hotkeys';
import { takeUntil } from 'rxjs/operators';
import { RangedQuestionEntity } from '../../../../../lib/entities/question/RangedQuestionEntity';
import { QuizPoolApiService } from '../../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-answeroptions-ranged',
  templateUrl: './answeroptions-ranged.component.html',
  styleUrls: ['./answeroptions-ranged.component.scss'],
})
export class AnsweroptionsRangedComponent extends AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'AnsweroptionsRangedComponent';

  protected _question: RangedQuestionEntity;

  get question(): RangedQuestionEntity {
    return this._question;
  }

  private _minRange: string;

  get minRange(): string {
    return this._minRange;
  }

  set minRange(value: string) {
    this._minRange = value;
  }

  private _maxRange: string;

  get maxRange(): string {
    return this._maxRange;
  }

  set maxRange(value: string) {
    this._maxRange = value;
  }

  private _correctValue: string;

  get correctValue(): string {
    return this._correctValue;
  }

  set correctValue(value: string) {
    this._correctValue = value;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    quizService: QuizService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    hotkeysService: HotkeysService,
    translate: TranslateService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route, hotkeysService, translate);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    const target = ['/quiz', 'manager', this._isQuizPool ? 'quiz-pool' : this._questionIndex, 'overview'];
    this.footerBarService.footerElemBack.onClickCallback = () => this.router.navigate(target);

    this.quizService.quizUpdateEmitter.pipe(takeUntil(this.destroy)).subscribe(() => {
      this._question = this.quizService.quiz.questionList[this._questionIndex] as RangedQuestionEntity;
      this._minRange = String(this._question.rangeMin);
      this._maxRange = String(this._question.rangeMax);
      this._correctValue = String(this._question.correctValue);
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this._question.rangeMin = parseInt(this._minRange, 10);
    this._question.rangeMax = parseInt(this._maxRange, 10);
    this._question.correctValue = parseInt(this._correctValue, 10);

    this.quizService.quiz.questionList[this._questionIndex] = this._question;
    this.quizService.persist();
  }

}
