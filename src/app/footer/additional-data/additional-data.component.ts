import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss'],
})
export class AdditionalDataComponent {
  public static readonly TYPE = 'AdditionalDataComponent';

  private _isShowingMore: boolean = window.innerWidth >= 768;

  public clipboardText = true;

  get isShowingMore(): boolean {
    return this._isShowingMore;
  }

  set isShowingMore(value: boolean) {
    this._isShowingMore = value;
  }

  constructor(
    @Inject(DOCUMENT) readonly document: Document,
    public quizService: QuizService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService
  ) {
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

  public renameQuiz(): void {
    const clone = JSON.parse(JSON.stringify(this.quizService.quiz));
    clone.name = null;
    const blob = new Blob([JSON.stringify(clone)], { type: 'application/json' });
    this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, null);
    this.fileUploadService.overrideLocalQuiz = this.quizService.quiz.name;
    this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
  }
}
