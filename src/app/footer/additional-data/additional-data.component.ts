import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss'],
})
export class AdditionalDataComponent {
  public static TYPE = 'AdditionalDataComponent';

  get quizUrl(): string {
    return this._quizUrl;
  }

  private _isShowingMore: boolean = window.innerWidth >= 768;

  get isShowingMore(): boolean {
    return this._isShowingMore;
  }

  set isShowingMore(value: boolean) {
    this._isShowingMore = value;
  }

  private readonly _quizUrl: string;

  constructor(@Inject(DOCUMENT) readonly document, public activeQuestionGroupService: ActiveQuestionGroupService, private trackingService: TrackingService) {
  }

  public getQuizUrl(quizName: string): string {
    return encodeURI(`${document.location.origin}/quiz/${quizName}`);
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
