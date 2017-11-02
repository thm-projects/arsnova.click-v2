import {Component, OnDestroy, OnInit} from '@angular/core';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ConnectionService} from '../../../service/connection.service';
import {AttendeeService} from '../../../service/attendee.service';
import {FooterBarService} from '../../../service/footer-bar.service';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss']
})
export class ConfidenceRateComponent implements OnInit, OnDestroy {
  get confidenceValue(): number {
    return this._confidenceValue;
  }

  private _confidenceValue = 100;
  public questionIndex: number;

  constructor(
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private http: HttpClient,
    private currentQuizService: CurrentQuizService,
    private router: Router,
    private footerBarService: FooterBarService
  ) {
    this.questionIndex = currentQuizService.previousQuestions.length;
    this.footerBarService.replaceFooterElements([]);
  }

  ngOnInit() {
    this.connectionService.authorizeWebSocket(this.currentQuizService.hashtag);
    this.handleMessages();
  }

  ngOnDestroy() {
  }

  private handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in confidence rate view', data.payload.nickname);
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
    });
  }

  getConfidenceLevel(): string {
    if (this.confidenceValue === 100) {
      return 'very_sure';
    } else if (this.confidenceValue > 70) {
      return 'quite_sure';
    } else if (this.confidenceValue > 50) {
      return 'unsure';
    } else if (this.confidenceValue > 20) {
      return 'not_sure';
    } else {
      return 'no_idea';
    }
  }

  updateConficence(event: Event) {
    this._confidenceValue = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  sendConfidence() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby/member/confidence-value`, {
      quizName: this.currentQuizService.hashtag,
      nickname: window.sessionStorage.getItem(`${this.currentQuizService.hashtag}_nick`),
      confidenceValue: this._confidenceValue,
      questionIndex: this.questionIndex
    }).subscribe(
      (data: IMessage) => {
        this.router.navigate(['/quiz', 'flow', 'results']);
      }
    );
  }

}
