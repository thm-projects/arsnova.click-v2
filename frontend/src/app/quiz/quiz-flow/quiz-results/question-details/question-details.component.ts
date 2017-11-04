import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IQuestion} from '../../../../../lib/questions/interfaces';
import {CurrentQuizService} from '../../../../service/current-quiz.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {QuestionTextService} from '../../../../service/question-text.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit, OnDestroy {
  get answers(): Array<string> {
    return this._answers;
  }
  get questionText(): string {
    return this._questionText;
  }

  get question(): IQuestion {
    return this._question;
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;
  private _questionText: string;
  private _answers: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private currentQuizService: CurrentQuizService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private questionTextService: QuestionTextService,
    private footerBarService: FooterBarService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  normalizeAnswerIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  ngOnInit() {
    this.questionTextService.getEmitter().subscribe((value: string | Array<string>) => {
      if (value instanceof Array) {
        this._answers = value;
      } else {
        this._questionText = value;
      }
    });
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      if (this._questionIndex < 0 || this._questionIndex > this.currentQuizService.questionIndex) {
        this.router.navigate(['/quiz', 'flow', 'results']);
        return;
      }
      this._question = this.currentQuizService.quiz.questionList[this._questionIndex];
      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
      this.questionTextService.change(this._question.questionText);
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
