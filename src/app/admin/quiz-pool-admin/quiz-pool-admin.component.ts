import { Component, OnInit } from '@angular/core';
import { IQuizPoolQuestion } from '../../lib/interfaces/quizzes/IQuizPoolQuestion';
import { QuizPoolApiService } from '../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../service/quiz/quiz.service';

enum QuizPoolSource {
  AllQuestions, //
  PendingQuestions, //
}

@Component({
  selector: 'app-quiz-pool-admin',
  templateUrl: './quiz-pool-admin.component.html',
  styleUrls: ['./quiz-pool-admin.component.scss'],
})
export class QuizPoolAdminComponent implements OnInit {
  private _allQuestions: Array<IQuizPoolQuestion> = [];
  private _pendingQuestions: Array<IQuizPoolQuestion> = [];
  private _currentSource = QuizPoolSource.PendingQuestions;

  private _questions: Array<IQuizPoolQuestion> = [];

  get questions(): Array<IQuizPoolQuestion> {
    return this._questions;
  }

  constructor(
    public quizService: QuizService,
    private quizPoolApiService: QuizPoolApiService,
    private footerBarService: FooterBarService,
  ) {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }

  public ngOnInit(): void {
    this.loadData();
  }

  public approveQuestion(question: IQuizPoolQuestion): void {
    this.quizPoolApiService.putApproveQuestion(question.id, question.question, true).subscribe(() => {
      const index = this._questions.findIndex(v => v.id === question.id);
      if (index === -1) {
        return;
      }

      this.loadData();
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

  public toggleSource(): void {
    if (this._currentSource === QuizPoolSource.AllQuestions) {
      this._questions = this._pendingQuestions;
      this._currentSource = QuizPoolSource.PendingQuestions;
    } else {
      this._questions = this._allQuestions;
      this._currentSource = QuizPoolSource.AllQuestions;
    }
  }

  public getCurrentSourceText(): string {
    return this._currentSource === QuizPoolSource.AllQuestions ? 'All Questions' : 'Pending Questions';
  }

  public getToggleSourceText(): string {
    return this._currentSource === QuizPoolSource.AllQuestions ? 'Pending Questions' : 'All Questions';
  }

  public getNotFoundText(): string {
    return this._currentSource === QuizPoolSource.AllQuestions ? 'No pool questions found' : 'No pending pool questions found';
  }

  private loadData(): void {
    this.quizPoolApiService.getQuizpoolQuestions().subscribe(data => {
      this._allQuestions = data.payload;
      if (this._currentSource === QuizPoolSource.AllQuestions) {
        this._questions = this._allQuestions;
      }
    });
    this.quizPoolApiService.getPendingQuizpool().subscribe(data => {
      this._pendingQuestions = data.payload;
      if (this._currentSource === QuizPoolSource.PendingQuestions) {
        this._questions = this._pendingQuestions;
      }
    });
  }
}
