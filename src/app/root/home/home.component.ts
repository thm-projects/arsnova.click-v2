import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../lib/AutoUnsubscribe';
import { checkABCDOrdering } from '../../../lib/checkABCDOrdering';
import { DefaultSettings } from '../../../lib/default.settings';
import { AbstractAnswerEntity } from '../../../lib/entities/answer/AbstractAnswerEntity';
import { DefaultAnswerEntity } from '../../../lib/entities/answer/DefaultAnswerEntity';
import { ABCDSingleChoiceQuestionEntity } from '../../../lib/entities/question/ABCDSingleChoiceQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbState, DbTable, Language, StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { QuizState } from '../../../lib/enums/QuizState';
import { UserRole } from '../../../lib/enums/UserRole';
import { AvailableQuizzesComponent } from '../../modals/available-quizzes/available-quizzes.component';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { ITrackClickEvent, TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
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
  public publicQuizAmount: number;
  public ownPublicQuizAmount: number;

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

  private _ownQuizzes: Array<string> = [];

  get ownQuizzes(): Array<string> {
    return this._ownQuizzes;
  }

  private _routerSubscription: Subscription;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private modalService: NgbModal,
    private quizService: QuizService,
    private router: Router,
    private themesService: ThemesService,
    private activatedRoute: ActivatedRoute,
    private i18nService: I18nService,
    private attendeeService: AttendeeService,
    private sanitizer: DomSanitizer,
    private casService: CasLoginService,
    private settingsService: SettingsService,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private storageService: StorageService,
    private userService: UserService,
    public connectionService: ConnectionService,
    public sharedService: SharedService,
  ) {

    this.footerBarService.TYPE_REFERENCE = HomeComponent.TYPE;

    headerLabelService.headerLabel = 'default';

    this.updateFooterElements(this.userService.isLoggedIn);
    this.userService.loginNotifier.subscribe(isLoggedIn => {
      this.updateFooterElements(isLoggedIn);
    });

    this.connectionService.initConnection().then(() => {
      if (!this.connectionService.socket) {
        return;
      }

      this.connectionService.disconnectFromChannel();
    });
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this._subscriptions.push(this.storageService.stateNotifier.subscribe(state => {
      if (state === DbState.Destroy) {
        this._subscriptions.forEach(sub => sub.unsubscribe());
        return;
      }

      if (state === DbState.Initialized) {
        this.cleanUpSessionStorage();
      }

      if (state === DbState.Revalidate) {
        this.cleanUpSessionStorage();
        this.storageService.getAllQuiznames().then(quizNames => {
          this._ownQuizzes = quizNames;
          if (this._ownQuizzes.length) {
            this.modalService.open(AvailableQuizzesComponent);
          }
        });

        this.quizApiService.getPublicQuizAmount().subscribe(val => {
          this.publicQuizAmount = val;
        });

        this.quizApiService.getOwnPublicQuizAmount().subscribe(val => {
          this.ownPublicQuizAmount = val;
        });
      }
    }));

    this._routerSubscription = this.activatedRoute.params.subscribe(params => {
      this._subscriptions.push(this.storageService.stateNotifier.subscribe(async val => {
        if ([DbState.Initialized, DbState.Revalidate].includes(val)) {
          if (!Object.keys(params).length || !params.themeId || !params.languageId) {
            const theme = this.storageService.read(DbTable.Config, StorageKey.DefaultTheme).toPromise();

            if (theme) {
              this.themesService.updateCurrentlyUsedTheme();
              return;
            }

            await this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, DefaultSettings.defaultQuizSettings.sessionConfig.theme)
            .toPromise();
            this.themesService.updateCurrentlyUsedTheme();

            return;
          }

          await this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, params.themeId).toPromise();
          this.i18nService.setLanguage(<Language>params.languageId.toUpperCase());
          this.themesService.updateCurrentlyUsedTheme();
        }
      }));
    });
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public autoJoinToSession(quizname): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.selectQuizByList(quizname);
    this.joinQuiz();

    this.router.navigate(['/quiz', quizname]);
  }

  public showQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('name-input-data-list');

      if (elem) {
        elem.classList.remove('d-none');
      }
    }
    this.isShowingQuiznameDatalist = true;
  }

  public hideQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('name-input-data-list');

      if (elem) {
        elem.classList.add('d-none');
      }
    }
    this.isShowingQuiznameDatalist = false;
  }

  public selectQuizByList(quizName: string): void {
    this.hideQuiznameDatalist();
    this.selectQuizByName(quizName);
  }

  public parseQuiznameInput(event: any): void {
    this.selectQuizByName(event.target.value.trim());
  }

  public setPassword(event: Event): void {
    this._serverPassword = (<HTMLInputElement>event.target).value;
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

  public editQuiz(): void {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    sessionStorage.setItem(StorageKey.CurrentQuizName, this.enteredSessionName);
    this.router.navigate(['/quiz', 'manager', 'overview']);
  }

  public addQuiz(): void {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    sessionStorage.setItem(StorageKey.CurrentQuizName, this.enteredSessionName);
    this.runQuiz(['/quiz', 'manager', 'overview']);
  }

  public joinQuiz(): void {
    sessionStorage.setItem(StorageKey.CurrentQuizName, this.enteredSessionName);
  }

  public async runQuiz(routingTarget: Array<string>): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    if (this.passwordRequired && !(this._serverPassword && this._serverPassword.length)) {
      return;
    }

    const questionGroupSerialized = await this.storageService.read(DbTable.Quiz, this.enteredSessionName).toPromise();
    const questionGroup = await new Promise<QuizEntity>((resolve) => {
      if (this.isAddingDemoQuiz) {
        this.addDemoQuiz().then(value => resolve(value));
      } else if (this.isAddingABCDQuiz) {
        this.addAbcdQuiz().then(value => resolve(value));
      } else if (questionGroupSerialized) {
        resolve(new QuizEntity(questionGroupSerialized));
      } else {
        resolve(new QuizEntity({
          name: this.enteredSessionName,
          sessionConfig: DefaultSettings.defaultQuizSettings.sessionConfig,
        }));
      }
    });

    this.reserveQuiz(questionGroup, routingTarget);
  }

  private updateFooterElements(isLoggedIn: boolean): void {
    const footerElements = [
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ];

    if (isLoggedIn) {
      if (this.userService.isAuthorizedFor(UserRole.EditI18n)) {
        footerElements.push(this.footerBarService.footerElemEditI18n);
      }
      if (this.userService.isAuthorizedFor([UserRole.SuperAdmin])) {
        footerElements.push(this.footerBarService.footerElemAdmin);
      }
      footerElements.push(this.footerBarService.footerElemLogout);

    } else {
      footerElements.push(this.footerBarService.footerElemLogin);

    }

    this.footerBarService.replaceFooterElements(footerElements);
  }

  private async reserveQuiz(questionGroup: QuizEntity, routingTarget: Array<string>): Promise<void> {
    this.quizApiService.setQuiz(questionGroup).subscribe(modifiedQuestionGroup => {
      this.quizService.quiz = new QuizEntity(questionGroup);
      this.quizService.persist();

      this.quizService.quiz = new QuizEntity(modifiedQuestionGroup);
      this.quizService.isOwner = true;

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

      this.router.navigate(routingTarget);
    }, error => {
      if (error === MessageProtocol.TooMuchActiveQuizzes) {
        this._hasErrors = 'plugins.splashscreen.error.error_messages.too_much_active_quizzes';
      } else if (error === MessageProtocol.ServerPasswordRequired) {
        this._hasErrors = 'plugins.splashscreen.error.error_messages.server_password_required';
      } else if (error === MessageProtocol.InsufficientPermissions) {
        this._hasErrors = 'plugins.splashscreen.error.error_messages.server_password_invalid';
      } else {
        console.log(error);
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

    if (this.ownQuizzes.find(quiz => quiz === quizName.toLowerCase())) {
      this.selectQuizAsExisting(quizName);
    } else if (quizName.toLowerCase() === 'demo quiz') {
      this.selectQuizAsDemoQuiz();
    } else if (checkABCDOrdering(quizName)) {
      this.selectQuizAsAbcdQuiz();
    } else {
      if (quizName.length > 3) {
        this.selectQuizAsDefaultQuiz(quizName);
      }
    }
  }

  private async selectQuizAsExisting(quizname): Promise<void> {
    const currentQuiz = new QuizEntity(await this.storageService.read(DbTable.Quiz, quizname).toPromise());
    this.canAddQuiz = false;
    this.canEditQuiz = true;
    this.canStartQuiz = this.connectionService.serverAvailable && //
                        (this.settingsService.serverSettings && !this.settingsService.serverSettings.createQuizPasswordRequired) && //
                        currentQuiz.isValid();
    this.passwordRequired = this.canStartQuiz && this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsDemoQuiz(): void {
    this.isAddingDemoQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsAbcdQuiz(): void {
    this.isAddingABCDQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
  }

  private selectQuizAsDefaultQuiz(quizName: string): void {
    this.quizApiService.getQuizStatus(quizName).subscribe(value => {
      if (value.status === StatusProtocol.Success) {
        if (value.step === MessageProtocol.AlreadyTaken || (value.payload.state && value.payload.state !== QuizState.Active)) {
          this.canAddQuiz = false;
          this.canJoinQuiz = false;
          this.passwordRequired = false;
          this.canStartQuiz = false;
        } else if (value.step === MessageProtocol.Available && value.payload.state === QuizState.Active) {
          this.canAddQuiz = false;
          this.canJoinQuiz = this.connectionService.serverAvailable;
          this.passwordRequired = false;
          this.canStartQuiz = false;
          this._provideNickSelection = value.payload.provideNickSelection;
          this.casService.casLoginRequired = value.payload.authorizeViaCas;
          if (this.casService.casLoginRequired) {
            this.casService.quizName = quizName;
          }
        } else if (value.step === MessageProtocol.Unavailable) {
          this.canAddQuiz = true;
          this.canJoinQuiz = false;
          this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
          this.canStartQuiz = false;
        } else {
          console.error('Invalid quiz status response in home component', value);
        }
      }
    });
  }

  private cleanUpSessionStorage(): void {
    this.attendeeService.cleanUp();
    this.quizService.cleanUp();
    this.connectionService.cleanUp();
    sessionStorage.removeItem(StorageKey.CurrentQuizName);
    sessionStorage.removeItem(StorageKey.CurrentNickName);
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.delete(DbTable.Config, StorageKey.QuizTheme).subscribe();
    }
  }

  private async addDemoQuiz(): Promise<QuizEntity> {
    const value = await this.quizApiService.generateDemoQuiz(this.i18nService.currentLanguage.toString()).toPromise();
    value.sessionConfig = Object.assign({}, DefaultSettings.defaultQuizSettings.sessionConfig, value.sessionConfig);
    const questionGroup = new QuizEntity(value);
    this.enteredSessionName = questionGroup.name;

    return questionGroup;
  }

  private async addAbcdQuiz(): Promise<QuizEntity> {
    const language = this.i18nService.currentLanguage.toString();
    const answerList = this.enteredSessionName.split('');

    if (isPlatformServer(this.platformId)) {
      return;
    }

    const hasMatchedABCDQuiz = this.ownQuizzes.filter(quizName => {
      return quizName.split(' ')[0] === this.enteredSessionName;
    });
    if (hasMatchedABCDQuiz.length) {
      const questionGroup = await this.storageService.read(DbTable.Quiz, hasMatchedABCDQuiz[0]).toPromise();
      const answerOptionList = (<Array<AbstractAnswerEntity>>[]);

      answerList.forEach((character, index) => {
        answerOptionList.push(new DefaultAnswerEntity({
          answerText: (String.fromCharCode(index + 65)),
          isCorrect: false,
        }));
      });
      this.enteredSessionName = questionGroup.name;
      const abcdQuestion: ABCDSingleChoiceQuestionEntity = new ABCDSingleChoiceQuestionEntity({
        questionText: '',
        timer: 60,
        displayAnswerText: false,
        answerOptionList,
        showOneAnswerPerRow: false,
      });
      questionGroup.questionList = [abcdQuestion];
      return new QuizEntity(questionGroup);

    } else {

      const value = await this.quizApiService.generateABCDQuiz(language, answerList.length).toPromise();
      Object.assign({}, DefaultSettings.defaultQuizSettings.sessionConfig, value.sessionConfig);

      const questionGroup = value;
      const answerOptionList = (<Array<AbstractAnswerEntity>>[]);

      answerList.forEach((character, index) => {
        answerOptionList.push(new DefaultAnswerEntity({
          answerText: (String.fromCharCode(index + 65)),
        }));
      });
      this.enteredSessionName = questionGroup.name;
      const abcdQuestion: ABCDSingleChoiceQuestionEntity = new ABCDSingleChoiceQuestionEntity({
        TYPE: QuestionType.ABCDSingleChoiceQuestion,
        questionText: '',
        timer: 60,
        displayAnswerText: false,
        answerOptionList,
        showOneAnswerPerRow: false,
      });
      questionGroup.questionList = [abcdQuestion];
      return new QuizEntity(questionGroup);
    }
  }
}
