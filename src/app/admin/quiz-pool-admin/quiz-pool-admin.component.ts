import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { IAdminQuiz } from '../../lib/interfaces/quizzes/IAdminQuiz';
import { IQuizPoolQuestion } from '../../lib/interfaces/quizzes/IQuizPoolQuestion';
import { QuizPoolApiService } from '../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../service/quiz/quiz.service';

@Component({
  selector: 'app-quiz-pool-admin',
  templateUrl: './quiz-pool-admin.component.html',
  styleUrls: ['./quiz-pool-admin.component.scss'],
})
export class QuizPoolAdminComponent implements OnInit {
  get questions(): Array<IQuizPoolQuestion> {
    return this._questions;
  }

  private _questions: Array<IQuizPoolQuestion> = [];

  constructor(
    private quizPoolApiService: QuizPoolApiService,
    private footerBarService: FooterBarService,
    private quizService: QuizService,
    private router: Router,
  ) {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }

  public ngOnInit(): void {
    this.quizPoolApiService.getPendingQuizpool().subscribe(data => {
      this._questions = data.payload;
    });
  }

  public approveQuestion(question: IQuizPoolQuestion): void {
    this.quizPoolApiService.putApproveQuestion(question.id, question.question, true).subscribe(() => {
      const index = this._questions.findIndex(v => v.id === question.id);
      if (index === -1) {
        return;
      }

      this._questions.splice(index, 1);
    });
  }

  public declineQuestion(question: IQuizPoolQuestion): void {
    this.quizPoolApiService.deletePoolQuestion(question.id).subscribe(() => {
      const index = this._questions.findIndex(v => v.id === question.id);
      if (index === -1) {
        return;
      }

      this._questions.splice(index, 1);
    });
  }

  public openQuestion(id: string): void {
    const index = this._questions.findIndex(v => v.id === id);
    if (index === -1) {
      return;
    }

    this.router.navigate(['/', 'quiz', 'manager', 'quiz-pool', this._questions[index].id, 'overview']);
  }
}
