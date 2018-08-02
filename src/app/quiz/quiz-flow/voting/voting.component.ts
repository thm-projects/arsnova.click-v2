import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { MultipleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_multiple';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { FreeTextQuestion } from 'arsnova-click-v2-types/src/questions/question_freetext';
import { RangedQuestion } from 'arsnova-click-v2-types/src/questions/question_ranged';
import { SurveyQuestion } from 'arsnova-click-v2-types/src/questions/question_survey';
import { Countdown } from '../../../../lib/countdown/countdown';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit, OnDestroy {
  public static TYPE = 'VotingComponent';
  public answers: Array<string> = [];

  private _countdown: Countdown;

  get countdown(): Countdown {
    return this._countdown;
  }

  set countdown(value: Countdown) {
    this._countdown = value;
  }

  private _countdownValue: number;

  get countdownValue(): number {
    return this._countdownValue;
  }

  set countdownValue(value: number) {
    this._countdownValue = value;
  }

  private _selectedAnswers: Array<number> | string | number = [];

  get selectedAnswers(): Array<number> | string | number {
    return this._selectedAnswers;
  }

  constructor(
    public currentQuizService: CurrentQuizService,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService,
    private questionTextService: QuestionTextService,
    private headerLabelService: HeaderLabelService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private quizApiService: QuizApiService,
    private memberApiService: MemberApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = VotingComponent.TYPE;

    headerLabelService.headerLabel = 'component.voting.title';

    this.footerBarService.replaceFooterElements([]);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public displayAnswerButtons(): boolean {
    const question = this.currentQuizService.currentQuestion();
    return question instanceof SingleChoiceQuestion || question instanceof SurveyQuestion || question instanceof MultipleChoiceQuestion;
  }

  public displayRangedButtons(): boolean {
    return this.currentQuizService.currentQuestion() instanceof RangedQuestion;
  }

  public displayFreetextInput(): boolean {
    return this.currentQuizService.currentQuestion() instanceof FreeTextQuestion;
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public isSelected(index: number): boolean {
    return this._selectedAnswers instanceof Array && this._selectedAnswers.indexOf(index) > -1;
  }

  public parseTextInput(event: Event): void {
    this._selectedAnswers = (
      <HTMLInputElement>event.target
    ).value;
  }

  public parseNumberInput(event: Event): void {
    this._selectedAnswers = parseInt((
      <HTMLInputElement>event.target
    ).value, 10);
  }

  public isNumber(value: any): boolean {
    return +value === value;
  }

  public showSendResponseButton(): boolean {
    return this.isNumber(this.selectedAnswers) || (
      this.selectedAnswers instanceof Array && !!this.selectedAnswers.length
    ) || (
             typeof this.selectedAnswers === 'string' && !!this.selectedAnswers.length
           );
  }

  public toggleSelectAnswer(index: number): void {
    if (!(
      this._selectedAnswers instanceof Array
    )) {
      return;
    }
    this.isSelected(index) ? this._selectedAnswers.splice(this._selectedAnswers.indexOf(index)) : this.toggleSelectedAnswers() ? this._selectedAnswers
      = [index] : this._selectedAnswers.push(index);
    if (this.toggleSelectedAnswers()) {
      this.sendResponses();
    }
  }

  public sendResponses(): void {
    if (this.countdown) {
      this.countdown.onChange.unsubscribe();
      this.countdown.stop();
    }
    this.router.navigate([
      '/quiz', 'flow', this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled ? 'confidence-rate' : 'results',
    ]);
  }

  public ngOnInit(): void {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });
    this.questionTextService.eventEmitter.subscribe((value: Array<string>) => this.answers = value);
    this.questionTextService.changeMultiple(this.currentQuizService.currentQuestion().answerOptionList.map(answer => answer.answerText));

    this.quizApiService.getQuizStartTime(this.currentQuizService.quiz.hashtag).subscribe((data) => {
      if (data.status === COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL && data.payload.startTimestamp) {

        if (this.currentQuizService.currentQuestion().timer) {
          this.countdown = new Countdown(this.currentQuizService.currentQuestion(), data.payload.startTimestamp);
          this.countdown.onChange.subscribe((value) => {
            this.countdownValue = value;
            if (!value) {
              this.sendResponses();
            }
          });
        }

      } else {

        this.router.navigate([
          '/quiz', 'flow', 'results',
        ]);

      }
    });
  }

  public ngOnDestroy(): void {
    console.log({
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: this.attendeeService.getOwnNick(),
      value: this._selectedAnswers,
    });

    this.memberApiService.putResponse({
      quizName: this.currentQuizService.quiz.hashtag,
      nickname: this.attendeeService.getOwnNick(),
      value: this._selectedAnswers,
    }).subscribe((data: IMessage) => {
      if (data.status !== COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
        console.log(data);
      }
    });
  }

  private handleMessages(): void {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case COMMUNICATION_PROTOCOL.MEMBER.UPDATED_RESPONSE:
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.RESET:
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case COMMUNICATION_PROTOCOL.LOBBY.CLOSED:
          this.router.navigate(['/']);
          break;
        case COMMUNICATION_PROTOCOL.QUIZ.STOP:
          this._selectedAnswers = [];
          this.router.navigate(['/quiz', 'flow', 'results']);
          break;
      }
    });
  }

  private toggleSelectedAnswers(): boolean {
    return this.currentQuizService.currentQuestion() instanceof SingleChoiceQuestion || (
      this.currentQuizService.currentQuestion() instanceof SurveyQuestion && !(
        <SurveyQuestion>this.currentQuizService.currentQuestion()
      ).multipleSelectionEnabled
    );
  }

}
