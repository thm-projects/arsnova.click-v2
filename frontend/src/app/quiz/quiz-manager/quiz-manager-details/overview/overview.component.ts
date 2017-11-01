import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {IQuestion} from '../../../../../lib/questions/interfaces';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
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
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private translateService: TranslateService,
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
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
