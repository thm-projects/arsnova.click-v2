import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../../lib/default.settings';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {Countdown} from '../quiz-results/quiz-results.component';
import {Router} from '@angular/router';
import {AttendeeService} from '../../../service/attendee.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ConnectionService} from '../../../service/connection.service';
import {SingleChoiceQuestion} from 'arsnova-click-v2-types/src/questions/question_choice_single';
import {SurveyQuestion} from 'arsnova-click-v2-types/src/questions/question_survey';
import {QuestionTextService} from '../../../service/question-text.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HeaderLabelService} from '../../../service/header-label.service';
import {MultipleChoiceQuestion} from 'arsnova-click-v2-types/src/questions/question_choice_multiple';
import {RangedQuestion} from 'arsnova-click-v2-types/src/questions/question_ranged';
import {FreeTextQuestion} from 'arsnova-click-v2-types/src/questions/question_freetext';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit, OnDestroy {
  set countdownValue(value: number) {
    this._countdownValue = value;
  }
  set countdown(value: Countdown) {
    this._countdown = value;
  }
  public static TYPE = 'VotingComponent';

  get countdown(): Countdown {
    return this._countdown;
  }
  get selectedAnswers(): Array<number> | string | number {
    return this._selectedAnswers;
  }
  get countdownValue(): number {
    return this._countdownValue;
  }

  private _countdown: Countdown;
  private _countdownValue: number;
  private _selectedAnswers: Array<number> | string | number = [];
  public answers: Array<string> = [];

  constructor(
    public currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService,
    private questionTextService: QuestionTextService,
    private headerLabelService: HeaderLabelService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {

    this.footerBarService.TYPE_REFERENCE = VotingComponent.TYPE;

    headerLabelService.headerLabel = 'component.voting.title';

    this.footerBarService.replaceFooterElements([]);

    this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/startTime/${currentQuizService.quiz.hashtag}`)
        .subscribe((data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL' && data.payload.startTimestamp) {

            if (currentQuizService.currentQuestion().timer) {
              this.countdown = new Countdown(currentQuizService.currentQuestion(), data.payload.startTimestamp);
              this.countdown.onChange.subscribe((value) => {
                this.countdownValue = value;
                if (!value) {
                  this.sendResponses();
                }
              });
            }

          } else {

            this.router.navigate([
              '/quiz',
              'flow',
              'results'
            ]);

          }
        });
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  displayAnswerButtons(): boolean {
    const question = this.currentQuizService.currentQuestion();
    return question instanceof SingleChoiceQuestion ||
           question instanceof SurveyQuestion ||
           question instanceof MultipleChoiceQuestion;
  }

  displayRangedButtons(): boolean {
    return this.currentQuizService.currentQuestion() instanceof RangedQuestion;
  }

  displayFreetextInput(): boolean {
    return this.currentQuizService.currentQuestion() instanceof FreeTextQuestion;
  }

  handleMessages(): void {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'MEMBER:UPDATED_RESPONSE':
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case 'LOBBY:CLOSED':
          this.router.navigate(['/']);
          break;
        case 'QUIZ:STOP':
          this._selectedAnswers = [];
          this.router.navigate(['/quiz', 'flow', 'results']);
          break;
      }
    });
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public isSelected(index: number): boolean {
    return this._selectedAnswers instanceof Array && this._selectedAnswers.indexOf(index) > -1;
  }

  public parseTextInput(event: Event): void {
    this._selectedAnswers = (<HTMLInputElement>event.target).value;
  }

  public parseNumberInput(event: Event): void {
    this._selectedAnswers = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public isNumber(value: any): boolean {
    return +value === value;
  }

  public showSendResponseButton(): boolean {
    return this.isNumber(this.selectedAnswers) ||
           (this.selectedAnswers instanceof Array && !!this.selectedAnswers.length) ||
           (typeof this.selectedAnswers === 'string' && !!this.selectedAnswers.length);
  }

  public toggleSelectAnswer(index: number): void {
    if (!(this._selectedAnswers instanceof Array)) {
      return;
    }
    this.isSelected(index) ? this._selectedAnswers.splice(this._selectedAnswers.indexOf(index)) :
    this.toggleSelectedAnswers() ? this._selectedAnswers = [index] : this._selectedAnswers.push(index);
    if (this.toggleSelectedAnswers()) {
      this.sendResponses();
    }
  }

  toggleSelectedAnswers(): boolean {
    return this.currentQuizService.currentQuestion() instanceof SingleChoiceQuestion ||
           (this.currentQuizService.currentQuestion() instanceof SurveyQuestion &&
            !(<SurveyQuestion>this.currentQuizService.currentQuestion()).multipleSelectionEnabled);
  }

  sendResponses(): void {
    if (this.countdown) {
      this.countdown.onChange.unsubscribe();
      this.countdown.stop();
    }
    this.router.navigate([
      '/quiz',
      'flow',
      this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled ? 'confidence-rate' : 'results'
    ]);
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });
    this.questionTextService.getEmitter().subscribe((value: Array<string>) => this.answers = value);
    this.questionTextService.changeMultiple(this.currentQuizService.currentQuestion().answerOptionList.map(answer => answer.answerText));
  }

  ngOnDestroy() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/member/response`, {
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: this.attendeeService.getOwnNick(),
      value: this._selectedAnswers
    }).subscribe(
      (data: IMessage) => {
        if (data.status !== 'STATUS:SUCCESSFUL') {
          console.log(data);
        }
      }
    );
  }

}
