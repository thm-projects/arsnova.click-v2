import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { Subscription } from 'rxjs';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';

@Component({
  selector: 'app-answeroptions',
  templateUrl: './answeroptions.component.html',
  styleUrls: ['./answeroptions.component.scss'],
})
export class AnsweroptionsComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsComponent';

  private _renderedComponent: string;

  get renderedComponent(): string {
    return this._renderedComponent;
  }

  private _questionIndex: number;
  private _question: IQuestion;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService) {

    this.footerBarService.TYPE_REFERENCE = AnsweroptionsComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour,
    ]);
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._renderedComponent = this._question.preferredAnsweroptionComponent;
    });
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}
