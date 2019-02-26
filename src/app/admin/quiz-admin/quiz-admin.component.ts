import { Component, OnInit } from '@angular/core';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { QuizState } from '../../../lib/enums/QuizState';
import { AdminService } from '../../service/api/admin/admin.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-admin',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.scss'],
})
export class QuizAdminComponent implements OnInit {
  private _quizzes: Array<QuizEntity>;

  get quizzes(): Array<QuizEntity> {
    return this._quizzes;
  }

  private _deletingElements: Array<number> = [];

  constructor(private footerBarService: FooterBarService, private adminService: AdminService) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminService.getAvailableQuizzes().subscribe(data => {
      this._quizzes = data;
    });
  }

  public isActiveQuiz(quiz): boolean {
    return [QuizState.Active, QuizState.Finished, QuizState.Running].includes(quiz.state);
  }

  public isDeletingElem(index: number): boolean {
    return this._deletingElements.indexOf(index) > -1;
  }

  public deleteElem($event: Event, index: number): void {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this._deletingElements.push(index);
    this.adminService.deleteQuiz((this._quizzes[index] as any).name || (this._quizzes[index] as any).originalObject.name).subscribe(() => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
      this._quizzes.splice(index, 1);
    }, () => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
    });
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
