import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ActivatedRoute} from '@angular/router';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {IQuestion} from '../../../../lib/questions/interfaces';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../../environments/environment';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit, OnDestroy {
  get question(): IQuestion {
    return this._question;
  }
  get questionIndex(): number {
    return this._questionIndex;
  }

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private route: ActivatedRoute,
              private footerBarService: FooterBarService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
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
