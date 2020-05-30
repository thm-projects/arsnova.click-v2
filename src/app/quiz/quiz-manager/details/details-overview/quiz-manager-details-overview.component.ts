import { Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { AbstractAnswerEntity } from '../../../../lib/entities/answer/AbstractAnswerEntity';
import { FreeTextAnswerEntity } from '../../../../lib/entities/answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { RangedQuestionEntity } from '../../../../lib/entities/question/RangedQuestionEntity';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { NotificationService } from '../../../../service/notification/notification.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss'],
})
export class QuizManagerDetailsOverviewComponent extends AbstractQuizManagerDetailsComponent implements OnDestroy {
  public static readonly TYPE = 'QuizManagerDetailsOverviewComponent';
  public readonly environment = environment;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    quizService: QuizService,
    headerLabelService: HeaderLabelService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    private trackingService: TrackingService,
    storageService?: StorageService,
    swPush?: SwPush,
    notificationService?: NotificationService,
    translate?: TranslateService,
  ) {
    super(
      platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route, storageService, swPush, notificationService,
      translate);

    footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
    ]);

    this.showSaveQuizButton = true;
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

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
}
