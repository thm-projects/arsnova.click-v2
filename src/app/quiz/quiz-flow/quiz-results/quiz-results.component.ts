import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { AudioPlayerConfigTarget } from '../../../lib/enums/AudioPlayerConfigTarget';
import { NumberType, StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { QuizState } from '../../../lib/enums/QuizState';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../lib/interfaces/entities/Member/IMemberSerialized';
import { IAudioPlayerConfig } from '../../../lib/interfaces/IAudioConfig';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { TwitterService } from '../../../service/twitter/twitter.service';
import { AudioPlayerComponent } from '../../../shared/audio-player/audio-player.component';
import { BonusTokenComponent } from './modals/bonus-token/bonus-token.component';
import { ToLobbyConfirmComponent } from './modals/to-lobby-confirm/to-lobby-confirm.component';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizResultsComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'QuizResultsComponent';

  private _hideProgressbarStyle = true;
  private _selectedQuestionIndex: number;
  private _questionText: string;
  private _serverUnavailableModal: NgbModalRef;
  private _showResponseProgress: boolean;
  private _footerElems: Array<any>;
  private _mustRequestReadingConfirmation: boolean;
  private readonly _messageSubscriptions: Array<string> = [];
  private readonly _destroy = new Subject();

  @ViewChild('countdownEndAudioComp') private readonly countdownEndAudioComp!: AudioPlayerComponent;

  public hasTriggeredNavigation: boolean;
  public countdown: number;
  public answers: Array<string> = [];
  public showStartQuizButton: boolean;
  public showStopCountdownButton: boolean;
  public showStopQuizButton: boolean;
  public isStarting: boolean;
  public isStopping: boolean;
  public isLoadingQuestionData: boolean;
  public countdownRunningMusicConfig: IAudioPlayerConfig;
  public countdownEndMusicConfig: IAudioPlayerConfig;
  public readonly environment = environment;

  set footerElems(value: Array<any>) {
    this._footerElems = value;
    this.footerBarService.replaceFooterElements(value);
  }

  get showResponseProgress(): boolean {
    return this._showResponseProgress;
  }

  set showResponseProgress(value: boolean) {
    this._showResponseProgress = value;
    this.cd.markForCheck();
  }

  get hideProgressbarStyle(): boolean {
    return this._hideProgressbarStyle;
  }

  set hideProgressbarStyle(value: boolean) {
    this._hideProgressbarStyle = value;
    this.cd.markForCheck();
  }

  get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }

  set selectedQuestionIndex(value: number) {
    this._selectedQuestionIndex = value;
    this.headerLabelService.headerLabelParams = {
      QUESTION_INDEX: (
        value + 1
      ),
    };
    this.twitterService.questionIndex = value;
    this.loadProgressbars();
    this.cd.markForCheck();
  }

  get questionText(): string {
    return this._questionText;
  }

  constructor(
    public quizService: QuizService,
    public attendeeService: AttendeeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private i18nService: I18nService,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private questionTextService: QuestionTextService,
    private quizApiService: QuizApiService,
    private ngbModal: NgbModal,
    private cd: ChangeDetectorRef,
    private messageQueue: SimpleMQ,
    private twitterService: TwitterService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizResultsComponent.TYPE;

    headerLabelService.headerLabel = 'component.liveResults.title';
  }

  public showLeaderBoardButton(index: number): boolean {
    if (this.countdown > 0 || !this.quizService.quiz || typeof index === 'undefined' || index < 0 || index
        > this.quizService.quiz.questionList.length) {
      return false;
    }
    if (index === this.quizService.quiz.currentQuestionIndex && //
        this.quizService.quiz.sessionConfig.readingConfirmationEnabled && //
        (
          this.quizService.readingConfirmationRequested || (
            this.countdown
          )
        )) {
      return false;
    }

    this.cd.markForCheck();
    return ![QuestionType.SurveyQuestion, QuestionType.ABCDSurveyQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showQuestionButton(index: number): boolean {
    if (this.countdown > 0 ||
        !this.quizService.quiz ||
        typeof index === 'undefined' ||
        index < 0 ||
        index > this.quizService.quiz.questionList.length
    ) {
      return false;
    }
    if (index === this.quizService.quiz.currentQuestionIndex && //
        (environment.readingConfirmationEnabled && this.quizService.quiz.sessionConfig.readingConfirmationEnabled) && //
        (this.quizService.readingConfirmationRequested || this.countdown) //
    ) {
      return false;
    }

    this.cd.markForCheck();
    return ![QuestionType.ABCDSurveyQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showConfidenceRate(questionIndex: number): boolean {
    this.cd.markForCheck();
    if (!environment.confidenceSliderEnabled || !this.quizService.quiz) {
      return;
    }

    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence > -1 : false;
    }).length;
    const hasConfidenceSet = this.quizService.quiz.sessionConfig.confidenceSliderEnabled;
    this.cd.markForCheck();
    return matchCount > 0 || (hasConfidenceSet && this.selectedQuestionIndex === this.quizService.quiz.currentQuestionIndex);
  }

  public modifyVisibleQuestion(index: number): void {
    if (!this.quizService.quiz || typeof index === 'undefined' || index < 0 || index > this.quizService.quiz.questionList.length) {
      return;
    }

    this.selectedQuestionIndex = index;
    this.generateAnswers(this.quizService.quiz.questionList[index]);
    this.cd.markForCheck();
  }

  public getConfidenceData(questionIndex: number): { base: number, absolute: number, percent: string } {
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0',
      ownConfidence: this.attendeeService.getConfidenceValue(),
    };
    if (questionIndex >= 0) {
      const matches = this.attendeeService.attendees.filter(value => {
        return value.responses[questionIndex] ? //
               value.responses[questionIndex].confidence > -1 ? //
               value.responses[questionIndex].confidence : //
               0 : //
               false;
      });
      const absoluteValues = matches.length ? this.attendeeService.attendees.map(value => {
        return value.responses[questionIndex] ? //
               value.responses[questionIndex].confidence > -1 ? //
               value.responses[questionIndex].confidence : //
               0 : //
               0;
      }).reduce((currentValue, nextValue) => {
        return currentValue + nextValue;
      }) : 0;
      result.absolute = matches.length;
      result.percent = this.i18nService.formatNumber(absoluteValues / (
        matches.length || 1
      ) / 100, NumberType.Percent);
    }
    this.cd.markForCheck();
    return result;
  }

  public showReadingConfirmation(questionIndex: number): boolean {
    this.cd.markForCheck();
    if (!environment.readingConfirmationEnabled || !this.quizService.quiz) {
      return;
    }

    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    const readingConfirmationStatus = environment.readingConfirmationEnabled && this.quizService.quiz.sessionConfig.readingConfirmationEnabled;
    this.cd.markForCheck();
    return matchCount > 0 || (readingConfirmationStatus && this.selectedQuestionIndex === this.quizService.quiz.currentQuestionIndex);
  }

  public getReadingConfirmationData(questionIndex: number): { base: number, absolute: number, percent: string } {
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0',
    };
    if (questionIndex >= 0) {
      const matchCount = this.attendeeService.attendees.filter(value => {
        return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
      }).length;
      result.absolute = matchCount;
      result.percent = this.i18nService.formatNumber(matchCount / (
        this.attendeeService.attendees.length || 1
      ), NumberType.Percent);
    }
    this.cd.markForCheck();
    return result;
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe((value: string | Array<string>) => {
      if (Array.isArray(value)) {
        this.answers = value;
      } else {
        this._questionText = value;
      }
      this.showResponseProgress = true;
    });

    this.quizService.quizUpdateEmitter.pipe(filter(quiz => Boolean(quiz)), takeUntil(this._destroy)).subscribe(async quiz => {
      if (this.hasTriggeredNavigation) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      const storedSelectedQuestionIndex = parseInt(sessionStorage.getItem(StorageKey.CurrentQuestionIndex), 10);
      if (!isNaN(storedSelectedQuestionIndex)) {
        this.modifyVisibleQuestion(storedSelectedQuestionIndex);
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      } else {
        this.modifyVisibleQuestion(this.quizService.quiz.currentQuestionIndex);
      }

      this.addFooterElements();
      await this.initData();

      this.cd.markForCheck();
    });

    this.isLoadingQuestionData = true;
    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {

      if (this.quizService.isOwner) {
        this.countdownRunningMusicConfig = {
          autostart: true,
          loop: true,
          hideControls: true,
          original_volume: String(this.quizService.quiz.sessionConfig.music.volumeConfig.useGlobalVolume ?
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.global :
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.countdownRunning),
          src: this.quizService.quiz.sessionConfig.music.titleConfig.countdownRunning,
          target: AudioPlayerConfigTarget.countdownRunning
        };

        this.countdownEndMusicConfig = {
          autostart: false,
          hideControls: true,
          loop: false,
          original_volume: String(this.quizService.quiz.sessionConfig.music.volumeConfig.useGlobalVolume ?
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.global :
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.countdownEnd),
          src: this.quizService.quiz.sessionConfig.music.titleConfig.countdownEnd,
          target: AudioPlayerConfigTarget.countdownEnd
        };
      }

      this.handleMessages();
      this.questionTextService.change(this.quizService.currentQuestion().questionText).subscribe(() => this.cd.markForCheck());
    }).catch(() => this.hasTriggeredNavigation = true);

    this.connectionService.serverStatusEmitter.pipe(takeUntil(this._destroy)).subscribe(isConnected => {
      if (isConnected) {
        if (this._serverUnavailableModal) {
          this._serverUnavailableModal.dismiss();
        }
        return;
      } else if (!isConnected && this._serverUnavailableModal) {
        return;
      }

      this.ngbModal.dismissAll();
      this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent, {
        keyboard: false,
        backdrop: 'static',
      });
      this._serverUnavailableModal.result.finally(() => this._serverUnavailableModal = null);
    });
  }

  public ngOnDestroy(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    sessionStorage.setItem(StorageKey.CurrentQuestionIndex, String(this.selectedQuestionIndex));

    if (this.quizService.isOwner) {
      this.footerBarService.footerElemBack.restoreClickCallback();
    } else {
      this.footerBarService.footerElemShowToken.restoreClickCallback();
    }

    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
    this._destroy.next();
    this._destroy.complete();
  }

  public stopQuiz(): void {
    this.isStopping = true;
    this.quizApiService.stopQuiz(this.quizService.quiz).subscribe(data => {
      if (data.status !== StatusProtocol.Success) {
        console.log('QuizResultsComponent: StopQuiz failed', data);
      }
    });
    this.cd.markForCheck();
    this.isStopping = false;
  }

  public async startQuiz(): Promise<void> {
    this.isStarting = true;
    this.hideProgressbarStyle = true;
    this.quizApiService.nextStep(this.quizService.quiz.name).subscribe(startQuizData => {
      if (startQuizData.status !== StatusProtocol.Success) {
        console.log('QuizResultsComponent: NextStep failed', startQuizData);
        this.isStarting = false;
        return;
      }

      this._mustRequestReadingConfirmation = startQuizData.step === MessageProtocol.ReadingConfirmationRequested;
    });
  }

  private initData(): Promise<void> {

    return this.quizApiService.getQuizStatus(this.quizService.quiz.name).toPromise().then(currentStateData => {
      if (currentStateData.status !== StatusProtocol.Success) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      if (currentStateData.payload.state === QuizState.Active) {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
        return;
      }

      this.quizService.readingConfirmationRequested = currentStateData.payload.readingConfirmationRequested;

      this.loadProgressbars(currentStateData);

      if (environment.enableBonusToken &&
          !this.quizService.isOwner &&
          this.quizService.quiz.questionList.length - 1 === this.quizService.quiz.currentQuestionIndex
      ) {
        this.quizApiService.getCanUseBonusToken().pipe(filter(canUseBonusToken => Boolean(canUseBonusToken))).subscribe(() => {
          this.footerElems = [this.footerBarService.footerElemShowToken].concat(this._footerElems);
          this.cd.markForCheck();
        });
      }

      this.isLoadingQuestionData = false;
      this.cd.markForCheck();
    });
  }

  private loadProgressbars(currentStateData?: IMessage): void {
    if (!this.countdown) {
      this.countdown = 0;
      const question = this.quizService.currentQuestion();
      const currentQuestionIndex = this.quizService.quiz.currentQuestionIndex;
      if (question?.timer === 0 &&
          !currentStateData?.payload.readingConfirmationRequested &&
          this.attendeeService.attendees.some(nick => nick.responses[currentQuestionIndex].responseTime === -1)
      ) {
        this.showStartQuizButton = false;
        this.hideProgressbarStyle = false;
        this.showStopQuizButton = this.quizService.isOwner;
      } else {
        if (currentStateData?.payload.readingConfirmationRequested) {
          this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length
                                     >= this.quizService.quiz.currentQuestionIndex;
          this.hideProgressbarStyle = this.selectedQuestionIndex === this.quizService.quiz.currentQuestionIndex;
        } else if (this.attendeeService.attendees.some(nick => nick.responses[currentQuestionIndex].responseTime > 0)) {
          this.showStartQuizButton = this.quizService.isOwner && //
                                     this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
          this.hideProgressbarStyle = false;
        } else {
          this.showStartQuizButton = false;
          this.hideProgressbarStyle = true;
        }
      }

    } else {
      if (this.attendeeService.attendees.every(nick => {
        const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
        if (!val) {
          return true;
        }

        return typeof val === 'number' ? val > -1 : val.length > 0;
      })) {
        console.log('QuizResultsComponent: Stopping countdown since all attendees have answered the current question');
        this.countdown = 0;
        this.hideProgressbarStyle = false;
        this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length
                                   > this.quizService.quiz.currentQuestionIndex + 1;

      } else if (currentStateData?.payload.readingConfirmationRequested) {
        console.log('QuizResultsComponent: Stopping countdown since reading confirmation is requested');
        this.countdown = 0;
        this.hideProgressbarStyle = this.selectedQuestionIndex === this.quizService.quiz.currentQuestionIndex;
        this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length
                                   >= this.quizService.quiz.currentQuestionIndex;
      } else {
        console.log('QuizResultsComponent: Countdown is proceeding');
        this.hideProgressbarStyle = currentStateData?.payload.startTimestamp > -1;
      }
    }
  }

  private addFooterElements(): void {

    let footerElems: Array<IFooterBarElement>;

    if (this.quizService.isOwner) {
      footerElems = [
        this.footerBarService.footerElemBack,
      ];
      if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
        footerElems.push(this.footerBarService.footerElemExport);
      } else {
        if (environment.readingConfirmationEnabled) {
          footerElems.splice(2, 0, this.footerBarService.footerElemReadingConfirmation);
        }
        if (environment.confidenceSliderEnabled) {
          footerElems.push(this.footerBarService.footerElemConfidenceSlider);
        }
      }
      this.footerBarService.footerElemBack.onClickCallback = async () => {
        this.ngbModal.open(ToLobbyConfirmComponent).result.then(() => {
          this.quizApiService.resetQuiz(this.quizService.quiz).subscribe(() => {
            this.quizService.quiz.currentQuestionIndex = -1;
          });
        }).catch(() => {
        });
      };
    } else {
      footerElems = [];
      if (environment.enableTwitter && this.twitterService.getOptIn()) {
        /*
         FIXME Disabled due to performance impacts
         footerElems.push(this.footerBarService.footerElemTwitterTweet);
         */
      }
      this.footerBarService.footerElemShowToken.onClickCallback = async () => {
        this.ngbModal.open(BonusTokenComponent);
      };
    }
    this.footerElems = footerElems;
    this.cd.markForCheck();
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.AllPlayers, payload => {
        payload.members.forEach((elem: IMemberSerialized) => {
          this.attendeeService.addMember(elem);
        });
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this.countdown = payload.value;
        this.hideProgressbarStyle = this.countdown > 0;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        this.attendeeService.removeMember(payload.name);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        this.attendeeService.modifyResponse(payload);
        console.log('QuizResultsComponent: modify response data for nickname', payload.nickname);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        this.selectedQuestionIndex = payload.nextQuestionIndex;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.quizService.quiz.currentStartTimestamp = payload.currentStartTimestamp;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.countdown = 0;
        this.hideProgressbarStyle = false;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.ngbModal.dismissAll();
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }),
    ]);

    this.quizService.isOwner ? this.handleMessagesForOwner() : this.handleMessagesForAttendee();
  }

  private handleMessagesForOwner(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, () => {
        const question = this.quizService.currentQuestion();
        this.generateAnswers(question);
        this.questionTextService.change(this.quizService.currentQuestion().questionText).subscribe(() => this.cd.markForCheck());

        if (environment.readingConfirmationEnabled && this._mustRequestReadingConfirmation) {
          this.quizService.readingConfirmationRequested = true;
          this._mustRequestReadingConfirmation = false;
          this.isStarting = false;
          this.cd.markForCheck();
          return;
        }

        this.quizService.readingConfirmationRequested = false;

        if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
          this.footerBarService.replaceFooterElements([
            this.footerBarService.footerElemBack,
          ]);
        }

        this.isStarting = false;
        this.cd.markForCheck();
      }),
      this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.showStartQuizButton = false;
        this.isStarting = false;
        this.showStopQuizButton = this.quizService.currentQuestion().timer === 0;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.showStopCountdownButton = false;
        this.showStopQuizButton = false;
        this.showStartQuizButton = this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
        if (!this.showStartQuizButton) {
          this.addFooterElements();
        }
        this.playEndSound();
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this.showStopCountdownButton = payload.value > 0;
        if (!payload.value) {
          this._mustRequestReadingConfirmation = environment.readingConfirmationEnabled &&
                                                 this.quizService.quiz.sessionConfig.readingConfirmationEnabled;
          if (this._mustRequestReadingConfirmation) {
            this.quizService.readingConfirmationRequested = false;
          }
          this.showStartQuizButton = !payload.value && this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
        }
        if (!this.showStartQuizButton) {
          this.addFooterElements();
        }
        if (!this.countdown) {
          this.playEndSound();
        }
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        this.showStartQuizButton = true;
        this.showStopQuizButton = false;
        this.hideProgressbarStyle = true;
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.cd.markForCheck();
      }),
    ]);
  }

  private handleMessagesForAttendee(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        if (environment.readingConfirmationEnabled) {
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        } else {
          this.router.navigate(['/quiz', 'flow', 'voting']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === payload.name) {
          this.hasTriggeredNavigation = true;
          this.router.navigate(['/']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        if (!this.attendeeService.hasResponse() ||
            [QuestionType.ABCDSurveyQuestion, QuestionType.SurveyQuestion].includes(this.quizService.currentQuestion().TYPE)
        ) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'answer-result']);
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        console.log(
          '[QuizResultsComponent]: Received event Countdown',
          payload.value,
          this.attendeeService.hasResponse(),
          [QuestionType.ABCDSurveyQuestion, QuestionType.SurveyQuestion].includes(this.quizService.currentQuestion().TYPE)
        );

        if (payload.value ||
            !this.attendeeService.hasResponse() ||
            [QuestionType.ABCDSurveyQuestion, QuestionType.SurveyQuestion].includes(this.quizService.currentQuestion().TYPE)
        ) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'answer-result']);
      })
    ]);
  }

  private generateAnswers(question: AbstractQuestionEntity): void {
    if (question.TYPE === QuestionType.RangedQuestion) {
      this.answers = ['component.liveResults.guessed_correct', 'component.liveResults.guessed_in_range', 'component.liveResults.guessed_wrong'];

    } else if (question.TYPE === QuestionType.FreeTextQuestion) {
      this.answers = ['component.liveResults.correct_answer', 'component.liveResults.wrong_answer'];

    } else {
      this.questionTextService.changeMultiple(question.answerOptionList.map(answer => {
        return answer.answerText;
      })).subscribe(() => this.cd.markForCheck());
    }
  }

  private playEndSound(): void {
    this.countdownEndAudioComp?.playMusic();
  }
}
