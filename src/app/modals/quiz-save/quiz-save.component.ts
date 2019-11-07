import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizVisibility } from '../../lib/enums/QuizVisibility';

@Component({
  selector: 'app-quiz-save',
  templateUrl: './quiz-save.component.html',
  styleUrls: ['./quiz-save.component.scss'],
})
export class QuizSaveComponent {
  public quizVisibility: string;
  public expiry: string;
  public description: string;
  public noExpiry: boolean;

  private _isSubmitting: boolean;

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  constructor(private activeModal: NgbActiveModal) {
    this.expiry = new Date(new Date().getTime() + 3600000 * 24 * 30).toISOString().split('T')[0];
  }

  public getQuizVisibility(): Array<string> {
    return [QuizVisibility.Any];
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public save(): void {
    this._isSubmitting = true;

    if (!this.quizVisibility || (!this.expiry && !this.noExpiry)) {
      this._isSubmitting = false;
      return;
    }

    this.activeModal.close({
      visibility: Object.entries(QuizVisibility).find(value => value[1] === this.quizVisibility)[0],
      expiry: this.noExpiry ? null : this.expiry,
      description: this.description,
    });
  }

  public isPublicVisibility(): boolean {
    return this.quizVisibility === QuizVisibility.Any;
  }
}
