import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ConnectionService} from '../../../service/connection.service';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {DefaultSettings} from '../../../../lib/default.settings';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {AttendeeService} from '../../../service/attendee.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {QuestionTextService} from '../../../service/question-text.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HeaderLabelService} from '../../../service/header-label.service';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss']
})
export class ReadingConfirmationComponent implements OnInit, OnDestroy {
  public static TYPE = 'ReadingConfirmationComponent';

  public questionIndex: number;
  public questionText: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private router: Router,
    private http: HttpClient,
    private currentQuizService: CurrentQuizService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService
  ) {

    this.footerBarService.TYPE_REFERENCE = ReadingConfirmationComponent.TYPE;
    headerLabelService.headerLabel = 'component.liveResults.reading_confirmation';
    this.questionIndex = currentQuizService.questionIndex;
    this.footerBarService.replaceFooterElements([]);
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });
    this.questionTextService.getEmitter().subscribe((value: string) => {
      this.questionText = value;
    });
    this.questionTextService.change(this.currentQuizService.currentQuestion().questionText);
  }

  ngOnDestroy() {
  }

  confirmReading() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/member/reading-confirmation`, {
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: window.sessionStorage.getItem(`config.nick`),
      questionIndex: this.questionIndex
    }).subscribe(
      (data: IMessage) => {
        this.router.navigate(['/quiz', 'flow', 'results']);
      }
    );
  }

  private handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in reading confirmation view', data.payload.nickname);
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
      }
    });
  }

}
