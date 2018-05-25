import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { Subscription } from 'rxjs';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss'],
})
export class QuizManagerDetailsOverviewComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizManagerDetailsOverviewComponent';

  private _question: IQuestion;

  get question(): IQuestion {
    return this._question;
  }

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
    private trackingService: TrackingService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemProductTour,
    ]);
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
    });
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  public trackDetailsTarget(link: string): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerDetailsOverviewComponent.TYPE,
      label: link,
    });
  }

}
