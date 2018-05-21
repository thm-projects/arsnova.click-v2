import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { DefaultSettings } from '../../../../lib/default.settings';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss'],
})
export class ConfidenceRateComponent implements OnInit {
  public static TYPE = 'ConfidenceRateComponent';

  private _confidenceValue = 100;

  get confidenceValue(): number {
    return this._confidenceValue;
  }

  constructor(
    public currentQuizService: CurrentQuizService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private http: HttpClient,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
  ) {

    headerLabelService.headerLabel = 'component.liveResults.confidence_grade';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });
  }

  public getConfidenceLevel(): string {
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

  public updateConficence(event: Event): void {
    this._confidenceValue = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public sendConfidence(): void {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/member/confidence-value`, {
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: window.sessionStorage.getItem(`config.nick`),
      confidenceValue: this._confidenceValue,
    }).subscribe(
      (data: IMessage) => {
        this.router.navigate(['/quiz', 'flow', 'results']);
      },
    );
  }

  private handleMessages(): void {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:NEXT_QUESTION':
          this.currentQuizService.questionIndex = data.payload.questionIndex;
          break;
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case 'QUIZ:STOP':
          this.router.navigate(['/quiz', 'flow', 'results']);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in confidence rate view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:READING_CONFIRMATION_REQUESTED':
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case 'LOBBY:CLOSED':
          this.router.navigate(['/']);
          break;
      }
    });
  }

}
