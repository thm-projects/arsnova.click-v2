import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {IQuestion} from 'arsnova-click-v2-types/src/questions/interfaces';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {TrackingService} from '../../../../service/tracking.service';

@Component({
  selector: 'app-quiz-manager-details-overview',
  templateUrl: './quiz-manager-details-overview.component.html',
  styleUrls: ['./quiz-manager-details-overview.component.scss']
})
export class QuizManagerDetailsOverviewComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizManagerDetailsOverviewComponent';

  get questionIndex(): number {
    return this._questionIndex;
  }

  get question(): IQuestion {
    return this._question;
  }

  private _question: IQuestion;
  private _questionIndex: number;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
    private trackingService: TrackingService
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizManagerDetailsOverviewComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour
    ]);
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
    });
  }

  ngOnDestroy() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  public trackDetailsTarget(target: string) {
    this.trackingService.trackClickEvent({
      action: QuizManagerDetailsOverviewComponent.TYPE,
      label: target,
    });
  }

}
