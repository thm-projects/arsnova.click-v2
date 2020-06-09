import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AbstractAnswerEntity } from '../../../../lib/entities/answer/AbstractAnswerEntity';
import { FreeTextAnswerEntity } from '../../../../lib/entities/answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { RangedQuestionEntity } from '../../../../lib/entities/question/RangedQuestionEntity';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { NotificationService } from '../../../../service/notification/notification.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizManagerDetailsOverviewComponent extends AbstractQuizManagerDetailsComponent implements AfterViewInit, OnDestroy {
  public static readonly TYPE = 'QuizManagerDetailsOverviewComponent';

  public renderedQuestionText: string;
  public renderedAnswers: Array<string> = [];

  public readonly environment = environment;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    quizService: QuizService,
    headerLabelService: HeaderLabelService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    hotkeysService: HotkeysService,
    translate: TranslateService,
    i18nService: I18nService,
    private trackingService: TrackingService,
    private sanitizer: DomSanitizer,
    private questionTextService: QuestionTextService,
    private cdRef: ChangeDetectorRef,
    storageService?: StorageService,
    swPush?: SwPush,
    notificationService?: NotificationService,
  ) {
    super(
      platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route, hotkeysService, translate, i18nService,
      storageService, swPush, notificationService);

    footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
      footerBarService.footerElemHotkeys
    ]);

    this.showSaveQuizButton = true;


    this.questionTextService.eventEmitter.pipe(takeUntil(this.destroy)).subscribe((value: string | Array<string>) => {
      if (Array.isArray(value)) {
        this.renderedAnswers = value;
      } else {
        this.renderedQuestionText = value;
      }
      this.cdRef.markForCheck();
    });

    this.initialized$.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.questionTextService.changeMultiple(this.question.answerOptionList.map(answer => answer.answerText)).pipe(take(1)).subscribe();
      this.questionTextService.change(this.question.questionText).pipe(take(1)).subscribe();
    });
  }

  public ngAfterViewInit(): void {
    this.i18nService.initialized.pipe(takeUntil(this.destroy)).subscribe(this.loadHotkeys.bind(this));
    this.translate.onLangChange.pipe(takeUntil(this.destroy)).subscribe(this.loadHotkeys.bind(this));
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.loadHotkeys();
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.hotkeysService.cheatSheetToggle.next(false);

    if (this.quizService.quiz) {
      this.quizService.persist();
    }
  }

  public trackDetailsTarget(link: string): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerDetailsOverviewComponent.TYPE,
      label: link,
    });
  }

  public sanitizeHTML(value: string): SafeHtml {
    // sanitizer.bypassSecurityTrustHtml is required for highslide and mathjax
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  public getQuestionAsRanged(question: AbstractQuestionEntity): RangedQuestionEntity {
    return question as RangedQuestionEntity;
  }

  public getAnswerAsFreetext(abstractAnswerEntity: AbstractAnswerEntity): FreeTextAnswerEntity {
    if (!abstractAnswerEntity) {
      return;
    }
    return new FreeTextAnswerEntity(abstractAnswerEntity);
  }

  public getQuizManagerDetailsRoutingTarget(): string | number {
    return this.quizService.isAddingPoolQuestion ? 'quiz-pool' : this.questionIndex;
  }

  public setRequiredForToken(question: AbstractQuestionEntity): void {
    question.requiredForToken = !question.requiredForToken;
    this.quizService.persist();
  }

  public canSelectRequiredState(question: AbstractQuestionEntity): boolean {
    return !this.quizService.isAddingPoolQuestion &&
           ![QuestionType.ABCDSingleChoiceQuestion, QuestionType.SurveyQuestion].includes(question?.TYPE);
  }

  public canSelectDifficulty(question: AbstractQuestionEntity): boolean {
    return ![QuestionType.ABCDSingleChoiceQuestion, QuestionType.SurveyQuestion].includes(question?.TYPE);
  }

  public getDifficultyTranslation(): string {
    if (this.question.difficulty < 3) {
      return 'component.quiz_summary.difficulty.very-easy';
    }
    if (this.question.difficulty < 5) {
      return 'component.quiz_summary.difficulty.easy';
    }
    if (this.question.difficulty === 5) {
      return 'component.quiz_summary.difficulty.medium';
    }
    if (this.question.difficulty < 8) {
      return 'component.quiz_summary.difficulty.challenging';
    }
    if (this.question.difficulty < 10) {
      return 'component.quiz_summary.difficulty.very-hard';
    }
    if (this.question.difficulty === 10) {
      return 'component.quiz_summary.difficulty.pro-only';
    }
  }

  private loadHotkeys(): void {
    this.hotkeysService.hotkeys = [];
    this.hotkeysService.reset();

    const hotkeys = [
      new Hotkey('esc', (): boolean => {
        this.footerBarService.footerElemBack.onClickCallback();
        return false;
      }, undefined, this.translate.instant('region.footer.footer_bar.back')),
      new Hotkey('ctrl+1', (): boolean => {
        this.router.navigate(['/quiz', 'manager', this._questionIndex, 'questionText']);
        return false;
      }, undefined, this.translate.instant('hotkey.navigate-to-question-text')),
      new Hotkey('ctrl+2', (): boolean => {
        this.router.navigate(['/quiz', 'manager', this._questionIndex, 'answeroptions']);
        return false;
      }, undefined, this.translate.instant('hotkey.navigate-to-answeroptions')),
      new Hotkey('ctrl+3', (): boolean => {
        this.router.navigate(['/quiz', 'manager', this._questionIndex, 'countdown']);
        return false;
      }, undefined, this.translate.instant('hotkey.navigate-to-countdown')),
      new Hotkey('ctrl+4', (): boolean => {
        this.router.navigate(['/quiz', 'manager', this._questionIndex, 'questionType']);
        return false;
      }, undefined, this.translate.instant('hotkey.navigate-to-question-type')),
      new Hotkey('ctrl+5', (): boolean => {
        this.router.navigate(['/quiz', 'manager', this._questionIndex, 'tags']);
        return false;
      }, undefined, this.translate.instant('hotkey.navigate-to-tags')),
      new Hotkey('ctrl+del', (): boolean => {
        this.quizService.quiz.removeQuestion(this._questionIndex);
        this.quizService.persist();
        this.footerBarService.footerElemBack.onClickCallback();
        return false;
      }, undefined, this.translate.instant('hotkey.delete-question'))
    ];

    if (this.quizService.quiz?.questionList.length > 1) {
      hotkeys.splice(1, 0,
        new Hotkey('alt+left', (): boolean => {
          const prevIndex = this.questionIndex - 1;
          this.router.navigate(['/quiz', 'manager', prevIndex === -1 ? 0 : prevIndex, 'overview']);
          return false;
        }, undefined, this.translate.instant('hotkey.navigate-to-prev-question')),
        new Hotkey('alt+right', (): boolean => {
          const nextIndex = this.questionIndex + 1;
          const maxIndex = this.quizService.quiz.questionList.length - 1;
          this.router.navigate(['/quiz', 'manager', nextIndex > maxIndex ? maxIndex : nextIndex, 'overview']);
          return false;
        }, undefined, this.translate.instant('hotkey.navigate-to-next-question')),
      );
    }

    this.hotkeysService.add(hotkeys);
    this.cdRef.markForCheck();
  }
}
