import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { QuizService } from '../../service/quiz/quiz.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss'],
})
export class AdditionalDataComponent {
  public static TYPE = 'AdditionalDataComponent';
  public clipboardText = true;

  private _isShowingMore: boolean = window.innerWidth >= 768;

  get isShowingMore(): boolean {
    return this._isShowingMore;
  }

  set isShowingMore(value: boolean) {
    this._isShowingMore = value;
  }

  constructor(@Inject(DOCUMENT) readonly document, public quizService: QuizService, private trackingService: TrackingService) {
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

  @HostListener('window:resize', [])
  public onResize(): void {
    this.isShowingMore = window.innerWidth >= 768;
  }

  public copyQuizLink(value: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.clipboardText = false;
    setTimeout(() => { this.clipboardText = true; }, 1000);
  }
}
