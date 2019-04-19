import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizService } from '../../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-qr-code-content',
  templateUrl: './qr-code-content.component.html',
  styleUrls: ['./qr-code-content.component.scss'],
})
export class QrCodeContentComponent {

  get qrCodeContent(): string {
    return this._qrCodeContent;
  }

  private readonly _qrCodeContent: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private quizService: QuizService, private activeModal: NgbActiveModal) {
    if (isPlatformBrowser(this.platformId)) {
      this._qrCodeContent = `${document.location.origin}/quiz/${encodeURIComponent(this.quizService.quiz.name.toLowerCase())}`;
    }
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
