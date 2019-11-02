import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuizState } from '../../../lib/enums/QuizState';
import { IAdminQuiz } from '../../../lib/interfaces/quizzes/IAdminQuiz';
import { AdminApiService } from '../../service/api/admin/admin-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-admin',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAdminComponent implements OnInit {
  public filterDemoQuiz = false;
  public filterAbcdQuiz = false;
  public filterActiveQuiz = false;
  public filterQuizName = '';

  private _quizzes: Array<IAdminQuiz> = [];

  get quizzes(): Array<IAdminQuiz> {
    return this._quizzes;
  }

  private _deletingElements: Array<string> = [];

  constructor(private footerBarService: FooterBarService, private adminApiService: AdminApiService, private cdRef: ChangeDetectorRef) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminApiService.getAvailableQuizzes().subscribe(data => {
      this._quizzes = data;
      this.cdRef.markForCheck();
    });
  }

  public isActiveQuiz(quiz: IAdminQuiz): boolean {
    return [QuizState.Active, QuizState.Finished, QuizState.Running].includes(quiz.state);
  }

  public deactivateQuiz(quiz: IAdminQuiz): void {
    this.adminApiService.deactivateQuiz(quiz.name).subscribe(() => {
      quiz.state = QuizState.Inactive;
      this.cdRef.markForCheck();
    }, error => console.error(error));
  }

  public isDeletingElem(quiz: IAdminQuiz): boolean {
    return this._deletingElements.indexOf(quiz.name) > -1;
  }

  public deleteElem($event: Event, quiz: IAdminQuiz): void {
    const index = this._deletingElements.push(quiz.name) - 1;
    this.adminApiService.deleteQuiz(quiz.name).subscribe(() => {
      this._deletingElements.splice(index, 1);
      const quizIndex = this._quizzes.findIndex(q => q.name === quiz.name);
      if (quizIndex > -1) {
        this._quizzes.splice(quizIndex, 1);
      }
      this.cdRef.markForCheck();
    }, (error) => {
      console.error(error);
    });
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
    this.cdRef.markForCheck();
  }
}
