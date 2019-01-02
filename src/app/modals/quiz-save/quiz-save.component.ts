import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizVisibility } from '../../../lib/enums/QuizVisibility';

@Component({
  selector: 'app-quiz-save',
  templateUrl: './quiz-save.component.html',
  styleUrls: ['./quiz-save.component.scss'],
})
export class QuizSaveComponent {
  public quizVisibility: QuizVisibility = QuizVisibility.Account;
  public expiry: string;
  public description: string;

  constructor(private activeModal: NgbActiveModal) {
    this.expiry = new Date(new Date().getTime() + 3600000 * 24 * 30).toISOString().split('T')[0];
  }

  public getQuizVisibility(): Array<string> {
    return Object.values(QuizVisibility);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public save(): void {
    this.activeModal.close({
      visibility: this.quizVisibility,
      expiry: this.expiry,
      description: this.description,
    });
  }

  public isPublicVisibility(): boolean {
    return this.quizVisibility === QuizVisibility.Any;
  }
}
