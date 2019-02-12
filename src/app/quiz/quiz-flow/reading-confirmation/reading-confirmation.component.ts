import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageProtocol } from '../../../../lib/enums/Message';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss'],
})
export class ReadingConfirmationComponent implements OnInit {
  public static TYPE = 'ReadingConfirmationComponent';

  public questionIndex: number;
  public questionText: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private router: Router,
    private quizService: QuizService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private memberApiService: MemberApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = ReadingConfirmationComponent.TYPE;
    headerLabelService.headerLabel = 'component.liveResults.reading_confirmation';
    this.questionIndex = quizService.quiz.currentQuestionIndex;
    this.footerBarService.replaceFooterElements([]);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this.connectionService.initConnection().then(() => {
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });

    this.questionTextService.eventEmitter.subscribe((value: string) => {
      this.questionText = value;
    });
    this.questionTextService.change(this.quizService.currentQuestion().questionText);
  }

  public confirmReading(): void {
    this.memberApiService.putReadingConfirmationValue().subscribe(() => {
      this.router.navigate(['/quiz', 'flow', 'results']);
    });
  }

  private handleMessages(): void {
    this.connectionService.dataEmitter.subscribe((data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.Inactive:
          setTimeout(this.handleMessages.bind(this), 500);
          break;
        case MessageProtocol.Start:
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case MessageProtocol.UpdatedResponse:
          console.log('modify response data for nickname in reading confirmation view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload);
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case MessageProtocol.Closed:
          this.router.navigate(['/']);
          break;
        case MessageProtocol.Added:
          this.attendeeService.addMember(data.payload.member);
          break;
        case MessageProtocol.Removed:
          this.attendeeService.removeMember(data.payload.name);
          break;
        case MessageProtocol.AllPlayers:
          data.payload.members.forEach((elem: IMemberSerialized) => {
            this.attendeeService.addMember(elem);
          });
          break;
      }
    });
  }

}
