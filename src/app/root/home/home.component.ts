import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { ABCDSingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single_abcd';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { Observable, Subscription } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { AvailableQuizzesComponent } from '../../modals/available-quizzes/available-quizzes.component';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService, Languages } from '../../service/i18n/i18n.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesService } from '../../service/themes/themes.service';
import { ITrackClickEvent, TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public static TYPE = 'HomeComponent';
  public canJoinQuiz = false;
  public canAddQuiz = false;
  public canEditQuiz = false;
  public canStartQuiz = false;
  public passwordRequired = false;
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName = '';

  get ownQuizzes(): Array<string> {
    return this._ownQuizzes;
  }

  private _provideNickSelection = false;

  get provideNickSelection(): boolean {
    return this._provideNickSelection;
  }

  private _serverPassword = '';

  get serverPassword(): string {
    return this._serverPassword;
  }

  private _hasErrors = '';

  get hasErrors(): string {
    return this._hasErrors;
  }

  private _isShowingQuiznameDatalist = false;

  get isShowingQuiznameDatalist(): boolean {
    return this._isShowingQuiznameDatalist;
  }

  set isShowingQuiznameDatalist(value: boolean) {
    this._isShowingQuiznameDatalist = value;
  }

  private readonly _routerSubscription: Subscription;
  private readonly _ownQuizzes: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private modalService: NgbModal,
              private activeQuestionGroupService: ActiveQuestionGroupService,
              private currentQuizService: CurrentQuizService,
              private router: Router,
              private themesService: ThemesService,
              private route: ActivatedRoute,
              private i18nService: I18nService,
              private attendeeService: AttendeeService,
              private connectionService: ConnectionService,
              private sanitizer: DomSanitizer,
              private casService: CasLoginService,
              private settingsService: SettingsService,
              private trackingService: TrackingService,
              private quizApiService: QuizApiService,
              private lobbyApiService: LobbyApiService,
              public sharedService: SharedService,
  ) {

    this.footerBarService.TYPE_REFERENCE = HomeComponent.TYPE;

    this._routerSubscription = this.route.params.subscribe(params => {
      if (!Object.keys(params).length) {
        return;
      }
      if (isPlatformBrowser(this.platformId)) {
        window.localStorage.setItem('config.default_theme', params.themeId);
      }
      this.themesService.updateCurrentlyUsedTheme();
      this.i18nService.setLanguage(<Languages>params.languageId.toUpperCase());
    });

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);

    headerLabelService.headerLabel = 'default';

    if (isPlatformBrowser(this.platformId)) {
      const ownedQuizzes = window.localStorage.getItem('config.owned_quizzes');
      if (!ownedQuizzes) {
        window.localStorage.setItem('config.owned_quizzes', '[]');
      }
      if (ownedQuizzes && JSON.parse(ownedQuizzes).length > 0) {
        this.modalService.open(AvailableQuizzesComponent);
      }
      this._ownQuizzes = JSON.parse(ownedQuizzes || '[]');

      this.cleanUpSessionStorage();
    }

    this.connectionService.initConnection().then(() => {

      this.connectionService.socket.subscribe(data => {
        console.log(data);
        this.connectionService.websocketAvailable = true;

        switch (data.step) {
          case 'QUIZ:SET_ACTIVE':
            this.sharedService.activeQuizzes.push(data.payload.quizName);
            break;
          case 'QUIZ:SET_INACTIVE':
            const index = this.sharedService.activeQuizzes.findIndex(name => name === data.payload.quizName);
            this.sharedService.activeQuizzes.splice(index, 1);
        }
      }, () => this.connectionService.websocketAvailable = false);
    });
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this.themesService.updateCurrentlyUsedTheme();
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  public autoJoinToSession(quizname): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.selectQuizByList(quizname);

    this.router.navigate(['/quiz', this.enteredSessionName]);
  }

  public showQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('hashtag-input-data-list');
      elem.classList.remove('d-none');
    }
    this.isShowingQuiznameDatalist = true;
  }

  public hideQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('hashtag-input-data-list');
      elem.classList.add('d-none');
    }
    this.isShowingQuiznameDatalist = false;
  }

  public selectQuizByList(quizName: string): void {
    this.hideQuiznameDatalist();
    console.log('selectquizbyname call');
    this.selectQuizByName(quizName);
  }

  public parseQuiznameInput(event: any): void {
    this.selectQuizByName(event.target.value.trim());
  }

  public setPassword(event: Event): void {
    this._serverPassword = (
      <HTMLInputElement>event.target
    ).value;
  }

  public handleClick(id: string): boolean {
    const trackingParams: ITrackClickEvent = {
      action: HomeComponent.TYPE,
      label: '',
      customDimensions: {
        dimension1: this.hasErrors,
        dimension2: this.passwordRequired,
      },
    };

    switch (id) {
      case 'joinSession':
        trackingParams.label = 'join-session';
        break;
      case 'addSession':
        trackingParams.label = 'add-session';
        break;
      case 'editSession':
        trackingParams.label = 'edit-session';
        break;
      case 'add-demo-quiz':
        trackingParams.label = 'add-demo-quiz';
        break;
      case 'add-abcd-quiz':
        trackingParams.label = 'add-abcd-quiz';
        break;
    }

    this.trackingService.trackClickEvent(trackingParams);

    return true;
  }

  public setActiveQuestionGroup(routingTarget?: Array<string>): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(
        localStorage.getItem(Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase())));

      if (questionGroupSerialized) {
        this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
      }
    }

    if (routingTarget) {
      this.router.navigate(routingTarget);
    }

    return true;
  }

  public async setAsCurrentQuiz(routingTarget: Array<string>): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    const questionGroupSerialized = JSON.parse(
      localStorage.getItem(Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase())));

    if (this.passwordRequired && !(
        this._serverPassword && this._serverPassword.length
    )) {
      return;
    }

    const questionGroup = await new Promise<IQuestionGroup>((resolve) => {
      if (this.isAddingDemoQuiz) {
        this.addDemoQuiz().then(value => resolve(value));
      } else if (this.isAddingABCDQuiz) {
        this.addAbcdQuiz().then(value => resolve(value));
      } else if (questionGroupSerialized) {
        resolve(questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized));
      } else {
        resolve(questionGroupReflection.DefaultQuestionGroup({
          hashtag: this.enteredSessionName,
          sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
        }));
      }
    });

    if (!window.localStorage.getItem('config.private_key')) {
      window.localStorage.setItem('config.private_key', this.activeQuestionGroupService.generatePrivateKey());
    }

    this.reserveQuiz(questionGroup, routingTarget);
  }

  private reserveQuiz(questionGroup: IQuestionGroup, routingTarget: Array<string>): void {
    this.quizApiService.postQuizReservation({
      quizName: this.enteredSessionName,
      privateKey: window.localStorage.getItem('config.private_key'),
      serverPassword: this._serverPassword,
    }).subscribe(async value => {

      if (value.status === 'STATUS:SUCCESSFUL') {
        this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
        this.activeQuestionGroupService.persist();

        this.currentQuizService.quiz = questionGroup;
        this.currentQuizService.persistToSessionStorage();

        if (this.isAddingABCDQuiz) {
          this.trackingService.trackConversionEvent({
            action: HomeComponent.TYPE,
            label: 'ABCD Quiz created',
          });
        } else if (this.isAddingDemoQuiz) {
          this.trackingService.trackConversionEvent({
            action: HomeComponent.TYPE,
            label: 'Demo Quiz created',
          });
        }

        await this.activateQuiz(questionGroup);

        this.router.navigate(routingTarget);

      } else {

        if (value.step === 'QUIZ:TOO_MUCH_ACTIVE_QUIZZES') {
          this._hasErrors = 'plugins.splashscreen.error.error_messages.too_much_active_quizzes';
        } else if (value.step === 'QUIZ:SERVER_PASSWORD_REQUIRED') {
          this._hasErrors = 'plugins.splashscreen.error.error_messages.server_password_required';
        } else if (value.step === 'QUIZ:INSUFFICIENT_PERMISSIONS') {
          this._hasErrors = 'plugins.splashscreen.error.error_messages.server_password_invalid';
        } else {
          console.log(value);
        }
      }
    });
  }

  private selectQuizByName(quizName: string): void {
    this.enteredSessionName = quizName;
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;

    if (isPlatformServer(this.platformId)) {
      return;
    }

    const currentQuizzes = JSON.parse(window.localStorage.getItem('config.owned_quizzes').toLowerCase()) || [];

    if (currentQuizzes.find(quiz => quiz === quizName.toLowerCase())) {
      this.selectQuizAsExisting(quizName);
    } else if (quizName.toLowerCase() === 'demo quiz') {
      this.selectQuizAsDemoQuiz();
    } else if (this.checkABCDOrdering(quizName.toLowerCase())) {
      this.selectQuizAsAbcdQuiz();
    } else {
      if (quizName.length > 3) {
        this.selectQuizAsDefaultQuiz(quizName);
      }
    }
  }

  private selectQuizAsExisting(quizname): void {
    const currentQuiz = JSON.parse(window.localStorage.getItem(quizname));
    const questionGroupInstance = questionGroupReflection[currentQuiz.TYPE](currentQuiz);
    this.canAddQuiz = false;
    this.canEditQuiz = true;
    this.canStartQuiz = questionGroupInstance.isValid();
    this.passwordRequired = this.canStartQuiz && this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsDemoQuiz(): void {
    this.isAddingDemoQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsAbcdQuiz(): void {
    this.isAddingABCDQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsDefaultQuiz(quizName: string): void {
    this.quizApiService.getQuizStatus(quizName).subscribe(value => {
      console.log('http returned', value);
      if (value.status === 'STATUS:SUCCESSFUL') {
        switch (value.step) {
          case 'QUIZ:EXISTS':
            this.canAddQuiz = false;
            this.canJoinQuiz = false;
            this.passwordRequired = false;
            break;
          case 'QUIZ:AVAILABLE':
            this.canAddQuiz = false;
            this.canJoinQuiz = true;
            this.passwordRequired = false;
            this._provideNickSelection = value.payload.provideNickSelection;
            this.casService.casLoginRequired = value.payload.authorizeViaCas;
            if (this.casService.casLoginRequired) {
              this.casService.quizName = quizName;
            }
            break;
          case 'QUIZ:UNDEFINED':
            this.canAddQuiz = true;
            this.canJoinQuiz = false;
            this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
            break;
          default:
            console.log(value);
        }
      }
    });
  }

  private cleanUpSessionStorage(): void {
    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this.activeQuestionGroupService.cleanUp();
    }
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('config.quiz_theme');
    }
    this.attendeeService.cleanUp();
    this.currentQuizService.cleanUp();
    this.connectionService.cleanUp();
  }

  private checkABCDOrdering(hashtag: string): boolean {
    let ordered = true;
    if (!hashtag || hashtag.length < 2 || hashtag.charAt(0) !== 'a') {
      return false;
    }
    for (let i = 1; i < hashtag.length; i++) {
      if (hashtag.charCodeAt(i) !== hashtag.charCodeAt(i - 1) + 1) {
        ordered = false;
        break;
      }
    }
    return ordered;
  }

  private activateQuiz(questionGroup: IQuestionGroup): Observable<IMessage> {
    return this.lobbyApiService.putLobby({
      quiz: questionGroup.serialize(),
    });
  }

  private async addDemoQuiz(): Promise<IQuestionGroup> {
    const value = await this.quizApiService.generateDemoQuiz(this.i18nService.currentLanguage.toString()).toPromise();
    Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);
    const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
    this.enteredSessionName = questionGroup.hashtag;

    return questionGroup;
  }

  private async addAbcdQuiz(): Promise<IQuestionGroup> {
    const language = this.i18nService.currentLanguage.toString();
    const answerList = this.enteredSessionName.split('');

    if (isPlatformServer(this.platformId)) {
      return;
    }

    const hasMatchedABCDQuiz = JSON.parse(window.localStorage.getItem('config.owned_quizzes')).filter(quizName => {
      return quizName.split(' ')[0] === this.enteredSessionName;
    });
    if (hasMatchedABCDQuiz.length) {
      const rawQuiz = JSON.parse(window.localStorage.getItem(hasMatchedABCDQuiz[0]));
      const questionGroup = questionGroupReflection.DefaultQuestionGroup(rawQuiz);
      const answerOptionList = (
        <Array<DefaultAnswerOption>>[]
      );

      answerList.forEach((character, index) => {
        answerOptionList.push(new DefaultAnswerOption({
          answerText: (
            String.fromCharCode(index + 65)
          ),
        }));
      });
      this.enteredSessionName = questionGroup.hashtag;
      const abcdQuestion = new ABCDSingleChoiceQuestion({
        questionText: '',
        timer: 60,
        displayAnswerText: false,
        answerOptionList,
        showOneAnswerPerRow: false,
      });
      questionGroup.questionList = [abcdQuestion];
      return questionGroup;

    } else {

      const value = await this.quizApiService.generateABCDQuiz(language, answerList.length).toPromise();
      Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);

      const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
      const answerOptionList = (
        <Array<DefaultAnswerOption>>[]
      );

      answerList.forEach((character, index) => {
        answerOptionList.push(new DefaultAnswerOption({
          answerText: (
            String.fromCharCode(index + 65)
          ),
        }));
      });
      this.enteredSessionName = questionGroup.hashtag;
      const abcdQuestion = new ABCDSingleChoiceQuestion({
        questionText: '',
        timer: 60,
        displayAnswerText: false,
        answerOptionList,
        showOneAnswerPerRow: false,
      });
      questionGroup.questionList = [abcdQuestion];
      return questionGroup;
    }
  }
}
