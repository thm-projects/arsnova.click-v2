import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../../lib/available-question-types';
import { QuestionType } from '../../../../../lib/enums/QuestionType';

@Component({
  selector: 'app-quiz-type-select-modal',
  templateUrl: './quiz-type-select-modal.component.html',
  styleUrls: ['./quiz-type-select-modal.component.scss'],
})
export class QuizTypeSelectModalComponent {
  public filterQuizType = '';

  private _selectableQuestionTypes: Array<IAvailableQuestionType> = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  constructor(private activeModal: NgbActiveModal) { }

  public close(id: QuestionType): void {
    if (!id) {
      this.dismiss();
      return;
    }

    this.activeModal.close(id);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
