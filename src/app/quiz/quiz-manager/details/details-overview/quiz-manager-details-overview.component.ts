import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractAnswerEntity } from '../../../../lib/entities/answer/AbstractAnswerEntity';
import { FreeTextAnswerEntity } from '../../../../lib/entities/answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { RangedQuestionEntity } from '../../../../lib/entities/question/RangedQuestionEntity';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss'],
})
export class QuizManagerDetailsOverviewComponent extends AbstractQuizManagerDetailsComponent {
  public static TYPE = 'QuizManagerDetailsOverviewComponent';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    quizService: QuizService,
    headerLabelService: HeaderLabelService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    private trackingService: TrackingService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route);

    footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
    ]);

    this.showSaveQuizButton = true;
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
}
