import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../../lib/default.settings';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {Countdown} from '../quiz-results/quiz-results.component';
import {Router} from '@angular/router';
import {AttendeeService} from '../../../service/attendee.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ConnectionService} from '../../../service/connection.service';
import {SingleChoiceQuestion} from '../../../../lib/questions/question_choice_single';
import {SurveyQuestion} from '../../../../lib/questions/question_survey';
import {QuestionTextService} from '../../../service/question-text.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit, OnDestroy {
  get countdownValue(): number {
    return this._countdownValue;
  }

  private _countdown: Countdown;
  private _countdownValue: number;
  private _selectedAnswers: Array<number> = [];
  private _toggleSelectedAnswers: boolean;
  public answers: Array<string> = [];

  constructor(
    public currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private router: Router) {

    this.footerBarService.replaceFooterElements([]);

    this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/startTime/${this.currentQuizService.hashtag}`)
        .subscribe((data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL' && data.payload.startTimestamp) {
            this._countdown = new Countdown(this.currentQuizService.currentQuestion, data.payload.startTimestamp);
            this._countdown.onChange.subscribe((value) => {
              this._countdownValue = value;
              if (!value) {
                this.router.navigate([
                  '/quiz',
                  'flow',
                  this.currentQuizService.sessionConfiguration.confidenceSliderEnabled ? 'confidence-rate' : 'results'
                ]);
              }
            });
          } else {
            this.router.navigate([
              '/quiz',
              'flow',
              'results'
            ]);
          }
        });

    this._toggleSelectedAnswers = this.currentQuizService.currentQuestion instanceof SingleChoiceQuestion;
    this._toggleSelectedAnswers = this._toggleSelectedAnswers &&
                                  !(<SurveyQuestion>this.currentQuizService.currentQuestion).multipleSelectionEnabled;
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in voting view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case 'LOBBY:CLOSED':
          this.router.navigate(['/']);
          break;
      }
      this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForAttendee(data: IMessage) {
    switch (data.step) {
    }
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public isSelected(index: number): boolean {
    return this._selectedAnswers.indexOf(index) > -1;
  }

  public toggleSelectAnswer(index: number): void {
    this.isSelected(index) ? this._selectedAnswers.splice(this._selectedAnswers.indexOf(index)) : this._toggleSelectedAnswers
      ? this._selectedAnswers = [index] : this._selectedAnswers.push(index);
    if (
      this.currentQuizService.currentQuestion instanceof SingleChoiceQuestion ||
      (this.currentQuizService.currentQuestion instanceof SurveyQuestion &&
      this.currentQuizService.currentQuestion.multipleSelectionEnabled)
    ) {
      this._countdown.remainingTime = 1;
    }
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.hashtag);
      this.handleMessages();
    });
    this.questionTextService.getEmitter().subscribe((value: Array<string>) => this.answers = value);
    this.questionTextService.changeMultiple(this.currentQuizService.currentQuestion.answerOptionList.map(answer => answer.answerText));
  }

  ngOnDestroy() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this.currentQuizService.hashtag,
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
