import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss'],
})
export class AdditionalDataComponent {
  public static TYPE = 'AdditionalDataComponent';
  public readonly questionGroupItem: IQuestionGroup;

  private _isShowingMore: boolean = window.innerWidth >= 768;

  get isShowingMore(): boolean {
    return this._isShowingMore;
  }

  set isShowingMore(value: boolean) {
    this._isShowingMore = value;
  }

  constructor(
    @Inject(DOCUMENT) readonly document,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
  ) {
    this.questionGroupItem = activeQuestionGroupService.activeQuestionGroup;
  }

  public switchShowMoreOrLess(): void {
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
  private onResize(): void {
    this.isShowingMore = window.innerWidth >= 768;
  }

}
