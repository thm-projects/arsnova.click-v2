import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {IQuestion} from '../../../../../lib/questions/interfaces';

@Component({
  selector: 'app-answeroptions',
  templateUrl: './answeroptions.component.html',
  styleUrls: ['./answeroptions.component.scss']
})
export class AnsweroptionsComponent implements OnInit, OnDestroy {
  get renderedComponent(): string {
    return this._renderedComponent;
  }

  private _questionIndex: number;
  private _question: IQuestion;
  private _routerSubscription: Subscription;
  private _renderedComponent: string;

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService) {
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
      this._renderedComponent = this._question.preferredAnsweroptionComponent;
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
