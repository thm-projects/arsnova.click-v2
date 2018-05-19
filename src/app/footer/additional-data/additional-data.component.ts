import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {TrackingService} from '../../service/tracking.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {
  public static TYPE = 'AdditionalDataComponent';

  set isShowingMore(value: boolean) {
    this._isShowingMore = value;
  }
  get isShowingMore(): boolean {
    return this._isShowingMore;
  }

  readonly questionGroupItem: IQuestionGroup;
  private _isShowingMore: boolean = window.innerWidth >= 768;

  constructor(
    @Inject(DOCUMENT) readonly document,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
  ) {
    this.questionGroupItem = activeQuestionGroupService.activeQuestionGroup;
  }

  ngOnInit() {
  }

  switchShowMoreOrLess() {
    if (this.isShowingMore) {
      this.trackingService.trackClickEvent({
        action: AdditionalDataComponent.TYPE,
        label: `show-less`,
      });
    } else {
      this.trackingService.trackClickEvent({
        action: AdditionalDataComponent.TYPE,
        label: `show-more`,
      });
    }
    this.isShowingMore = !this.isShowingMore;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isShowingMore = window.innerWidth >= 768;
  }

}
