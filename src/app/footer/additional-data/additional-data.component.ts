import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {QuizManagerComponent} from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import {TrackingService} from '../../service/tracking.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {
  public static TYPE = 'AdditionalDataComponent';

  get showMoreOrLess(): string {
    return this._showMoreOrLess;
  }

  set showMoreOrLess(value: string) {
    this._showMoreOrLess = value;
  }

  readonly questionGroupItem: IQuestionGroup;
  private _isShowingMore: boolean;
  private _showMoreOrLess = 'component.quiz_manager.show_more';

  constructor(
    @Inject(DOCUMENT) readonly document,
    private translateService: TranslateService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
  ) {
    this.questionGroupItem = activeQuestionGroupService.activeQuestionGroup;
  }

  ngOnInit() {
  }

  switchShowMoreOrLess() {
    if (this._showMoreOrLess.indexOf('more') > -1) {
      this._showMoreOrLess = this._showMoreOrLess.replace('more', 'less');
      this._isShowingMore = true;
      this.trackingService.trackClickEvent({
        action: QuizManagerComponent.TYPE,
        label: `show-more`,
      });
    } else {
      this._showMoreOrLess = this._showMoreOrLess.replace('less', 'more');
      this._isShowingMore = false;
      this.trackingService.trackClickEvent({
        action: QuizManagerComponent.TYPE,
        label: `show-less`,
      });
    }
  }

}
