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
  public filterDemoQuiz: boolean;
  public filterAbcdQuiz: boolean;
  public filterActiveQuiz: boolean;
  public filterQuizName: string;

  private _quizzes: Array<QuizEntity>;

  get quizzes(): Array<QuizEntity> {
    return this._quizzes;
  }

  private _deletingElements: Array<string> = [];

  constructor(private footerBarService: FooterBarService, private adminService: AdminService) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminService.getAvailableQuizzes().subscribe(data => {
      this._quizzes = data;
    });
  }

  public isActiveQuiz(quiz: QuizEntity): boolean {
    return [QuizState.Active, QuizState.Finished, QuizState.Running].includes(quiz.state);
  }

  public deactivateQuiz(quiz: QuizEntity): void {
    this.adminService.deactivateQuiz(quiz.name).subscribe(() => {
      quiz.state = QuizState.Inactive;
    }, error => console.error(error));
  }

  public isDeletingElem(quiz: QuizEntity): boolean {
    return this._deletingElements.indexOf(quiz.name) > -1;
  }

  public deleteElem($event: Event, quiz: QuizEntity): void {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this._deletingElements.push(quiz.name);
    this.adminService.deleteQuiz(quiz.name).subscribe(() => {
      this._deletingElements.splice(this._deletingElements.indexOf(quiz.name), 1);
      this._quizzes.splice(this._quizzes.indexOf(quiz), 1);
    }, (error) => {
      console.error(error);
    });
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
