import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { Subscription } from 'rxjs/index';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { StorageService } from '../../../service/storage/storage.service';
import { DB_TABLE, STORAGE_KEY } from '../../../shared/enums';

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
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private memberApiService: MemberApiService,
    private storageService: StorageService,
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
    this._confidenceValue = parseInt((
      <HTMLInputElement>event.target
    ).value, 10);
  }

  public async sendConfidence(): Promise<Subscription> {
    return this.memberApiService.putConfidenceValue({
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.NICK).toPromise(),
      confidenceValue: this._confidenceValue,
    }).subscribe((data: IMessage) => {
      this.router.navigate(['/quiz', 'flow', 'results']);
    });
  }

  private handleMessages(): void {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case COMMUNICATION_PROTOCOL.QUIZ.NEXT_QUESTION:
          this.currentQuizService.questionIndex = data.payload.questionIndex;
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.START:
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.STOP:
          this.router.navigate(['/quiz', 'flow', 'results']);
          break;
        case COMMUNICATION_PROTOCOL.MEMBER.UPDATED_RESPONSE:
          console.log('modify response data for nickname in confidence rate view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.READING_CONFIRMATION_REQUESTED:
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.RESET:
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case COMMUNICATION_PROTOCOL.LOBBY.CLOSED:
          this.router.navigate(['/']);
          break;
      }
    });
  }

}
