import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IMessage, INickname } from 'arsnova-click-v2-types/src/common';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit {
  public static TYPE = 'QuestionDetailsComponent';

  private _question: IQuestion;

  get question(): IQuestion {
    return this._question;
  }

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  set questionIndex(value: number) {
    this._questionIndex = value;
  }

  private _questionText: string;

  get questionText(): string {
    return this._questionText;
  }

  private _answers: Array<string>;

  get answers(): Array<string> {
    return this._answers;
  }

  constructor(
    private route: ActivatedRoute,
    private currentQuizService: CurrentQuizService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private questionTextService: QuestionTextService,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestionDetailsComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen,
    ]);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public normalizeAnswerIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public async ngOnInit(): Promise<void> {
    await this.connectionService.initConnection();
    this.handleMessages();

    this.questionTextService.eventEmitter.subscribe((value: string | Array<string>) => {
      if (value instanceof Array) {
        this._answers = value;
      } else {
        this._questionText = value;
      }
    });
    const params = await this.route.params.toPromise();

    this._questionIndex = +params['questionIndex'];
    if (this._questionIndex < 0 || this._questionIndex > this.currentQuizService.questionIndex) {
      this.router.navigate(['/quiz', 'flow', 'results']);
      return;
    }
    this._question = this.currentQuizService.quiz.questionList[this._questionIndex];
    await this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
    await this.questionTextService.change(this._question.questionText);
  }

  private handleMessages(): void {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: 'STATUS:SUCCESSFUL',
        step: 'LOBBY:GET_PLAYERS',
        payload: { quizName: this.currentQuizService.quiz.hashtag },
      });
    }
    this.connectionService.socket.subscribe(async (data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:NEXT_QUESTION':
          this.currentQuizService.questionIndex = data.payload.questionIndex;
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
      }
      await this.currentQuizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage): void {
    switch (data.step) {
      default:
        return;
    }
  }

  private handleMessagesForAttendee(data: IMessage): void {
    switch (data.step) {
      case 'QUIZ:START':
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case 'QUIZ:READING_CONFIRMATION_REQUESTED':
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case 'LOBBY:CLOSED':
        this.router.navigate(['/']);
        break;
    }
  }

}
