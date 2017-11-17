import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IQuestion} from 'arsnova-click-v2-types/src/questions/interfaces';
import {CurrentQuizService} from '../../../../service/current-quiz.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {QuestionTextService} from '../../../../service/question-text.service';
import {AttendeeService} from '../../../../service/attendee.service';
import {ConnectionService} from '../../../../service/connection.service';
import {IMessage, INickname} from 'arsnova-click-v2-types/src/common';

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
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemFullscreen
    ]);
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  normalizeAnswerIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  handleMessages() {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: 'STATUS:SUCCESSFUL',
        step: 'LOBBY:GET_PLAYERS',
        payload: {quizName: this.currentQuizService.quiz.hashtag}
      });
    }
    this.connectionService.socket.subscribe((data: IMessage) => {
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
      this.currentQuizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage) {
    switch (data.step) {
      default:
        return;
    }
  }

  private handleMessagesForAttendee(data: IMessage) {
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

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.handleMessages();
    });
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
