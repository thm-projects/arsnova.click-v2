import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {Countdown} from '../quiz-results/quiz-results.component';
import {Router} from '@angular/router';
import {AttendeeService} from '../../../service/attendee.service';
import {IAnswerOption} from '../../../../lib/answeroptions/interfaces';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ConnectionService} from '../../../service/connection.service';

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
  private _startResponseTime;
  private _selectedAnswers: Array<number> = [];
  private _toggleSelectedAnswers: boolean;

  constructor(public currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService,
    private router: Router) {

    this.footerBarService.replaceFooterElments([]);

    this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/startTime/${this.currentQuizService.hashtag}`)
        .subscribe((data: IMessage) => {
          this._startResponseTime = new Date().getTime();
          if (data.status === 'STATUS:SUCCESSFUL') {
            this._countdown = new Countdown(this.currentQuizService.currentQuestion, data.payload.startTimestamp);
            this._countdown.onChange.subscribe((value) => {
              this._countdownValue = value;
              if (!value) {
                this.router.navigate(['/quiz', 'flow', 'results']);
              }
            });
          }
        });

    this._toggleSelectedAnswers = ['SingleChoiceQuestion'].indexOf(this.currentQuizService.currentQuestion.TYPE) > -1;
    this._toggleSelectedAnswers = this._toggleSelectedAnswers && !this.currentQuizService.currentQuestion.multipleSelectionEnabled;
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
    this.isSelected(index) ?
    this._selectedAnswers.splice(this._selectedAnswers.indexOf(index)) :
    this._toggleSelectedAnswers ? this._selectedAnswers = [index] : this._selectedAnswers.push(index);
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.hashtag);
      this.handleMessages();
    });
  }

  ngOnDestroy() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this.currentQuizService.hashtag,
      nickname: this.attendeeService.getOwnNick(),
      value: this._selectedAnswers,
      responseTime: (new Date().getTime() - this._startResponseTime) / 1000
    }).subscribe(
      (data: IMessage) => {
        if (data.status !== 'STATUS:SUCCESSFUL') {
          console.log(data);
        }
      }
    );
  }

}
