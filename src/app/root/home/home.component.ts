import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, mergeMap, switchMapTo, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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
import { MemberApiService } from '../../service/api/member/member-api.service';
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
  public publicQuizAmount: number;
  public ownPublicQuizAmount: number;
  public canModifyQuiz: boolean = !environment.requireLoginToCreateQuiz;
  public canUsePublicQuizzes: boolean = !environment.requireLoginToCreateQuiz;
  public showJoinableQuizzes: boolean = environment.showJoinableQuizzes;
  public isQueryingQuizState: boolean;

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

  private readonly _destroy = new Subject();
  private _isPerformingClick: Array<string> = [];

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
    public memberApiService: MemberApiService,
  ) {

    sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
    this.footerBarService.TYPE_REFERENCE = HomeComponent.TYPE;

    headerLabelService.headerLabel = 'default';

    this.updateFooterElements(this.userService.isLoggedIn);
    this.canModifyQuiz = !environment.requireLoginToCreateQuiz || this.userService.isAuthorizedFor(UserRole.QuizAdmin);
    this.canUsePublicQuizzes = (environment.showPublicQuizzes || this.userService.isAuthorizedFor(UserRole.QuizAdmin))
                               && !environment.requireLoginToCreateQuiz || this.userService.isAuthorizedFor(UserRole.CreateQuiz);

    this.quizService.stopEditMode();
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.userService.loginNotifier.pipe(takeUntil(this._destroy)).subscribe(isLoggedIn => {
      this.updateFooterElements(isLoggedIn);
      this.canModifyQuiz = !environment.requireLoginToCreateQuiz || (isLoggedIn && this.userService.isAuthorizedFor(UserRole.QuizAdmin));
      this.canUsePublicQuizzes = !environment.requireLoginToCreateQuiz || (isLoggedIn && this.userService.isAuthorizedFor(UserRole.CreateQuiz));
    });

    this.storageService.stateNotifier.pipe(takeUntil(this._destroy)).subscribe(state => {
      if (state === DbState.Destroy) {
        return;
      }

      if (state === DbState.Initialized) {
        this.cleanUpSessionStorage();
      }

      if (state === DbState.Revalidate) {
        this.cleanUpSessionStorage();
        this.storageService.getAllQuiznames().then(quizNames => {
          this._ownQuizzes = quizNames;

          if (this._ownQuizzes.length && //
              environment.showJoinableQuizzes && //
              (!environment.requireLoginToCreateQuiz || this.userService.isAuthorizedFor(UserRole.CreateQuiz))) {
            this.modalService.open(AvailableQuizzesComponent);
          }
        });

        if (environment.showPublicQuizzes || this.userService.isAuthorizedFor(UserRole.QuizAdmin)) {
          this.quizApiService.getPublicQuizAmount().subscribe(val => {
            this.publicQuizAmount = val;
          });
          this.quizApiService.getOwnPublicQuizAmount().subscribe(val => {
            this.ownPublicQuizAmount = val;
          });
        }
      }
    });

    const params$ = this.activatedRoute.paramMap.pipe(distinctUntilChanged(), takeUntil(this._destroy));

    this.storageService.stateNotifier.pipe(mergeMap(val => of(![DbState.Initialized, DbState.Revalidate].includes(val))), filter(val => !val),
      distinctUntilChanged(), takeUntil(this._destroy), switchMapTo(params$)).subscribe(async params => {

      if (!Object.keys(params).length || !params.get('themeId') || !params.get('languageId')) {
        const theme = this.storageService.read(DbTable.Config, StorageKey.DefaultTheme).toPromise();
        if (!theme) {
          await this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, this.themesService.defaultTheme).toPromise();
        }
      } else {
        await this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, params.get('themeId')).toPromise();
        this.i18nService.setLanguage(<Language>params.get('languageId').toUpperCase());
      }
      this.themesService.updateCurrentlyUsedTheme();
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
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
    if (environment.showJoinableQuizzes) {
      this.isShowingQuiznameDatalist = true;
    }
  }

  public hideQuiznameDatalist(): void {
    this.isShowingQuiznameDatalist = false;
  }

  public selectQuizByList(quizName: string): void {
    this.hideQuiznameDatalist();
    this.selectQuizByName(quizName);
  }

  public parseQuiznameInput(event: any): void {
    this.isQueryingQuizState = true;
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

    if (!this._isPerformingClick.includes(id)) {
      this._isPerformingClick.push(id);
    }

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

  public isPerformingClick(id: string): boolean {
    return this._isPerformingClick.includes(id);
  }

  public resetSessionName(): void {
    this.enteredSessionName = '';
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;
  }

  private updateFooterElements(isLoggedIn: boolean): void {
    const footerElements = [
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
    ];

    if (!environment.requireLoginToCreateQuiz && (environment.showPublicQuizzes || this.userService.isAuthorizedFor(UserRole.QuizAdmin))) {
      footerElements.push(this.footerBarService.footerElemHashtagManagement);
      footerElements.push(this.footerBarService.footerElemImport);
    }

    if (isLoggedIn) {
      if (environment.requireLoginToCreateQuiz && (environment.showPublicQuizzes || this.userService.isAuthorizedFor(UserRole.QuizAdmin))) {
        if (this.userService.isAuthorizedFor(UserRole.CreateQuiz)) {
          footerElements.push(this.footerBarService.footerElemHashtagManagement);
        }

        if (this.userService.isAuthorizedFor(UserRole.QuizAdmin)) {
          footerElements.push(this.footerBarService.footerElemImport);
        }
      }

      if (this.userService.isAuthorizedFor(UserRole.EditI18n)) {
        footerElements.push(this.footerBarService.footerElemEditI18n);
      }

      if (this.userService.isAuthorizedFor([UserRole.SuperAdmin])) {
        footerElements.push(this.footerBarService.footerElemAdmin);
      }

      footerElements.push(this.footerBarService.footerElemLogout);

    } else {
      if (environment.loginMechanism && environment.loginMechanism.length) {
        footerElements.push(this.footerBarService.footerElemLogin);
      }
    }

    this.footerBarService.replaceFooterElements(footerElements);
  }

  private async reserveQuiz(questionGroup: QuizEntity, routingTarget: Array<string>): Promise<void> {
    this.quizApiService.setQuiz(questionGroup).subscribe(modifiedQuestionGroup => {
      this.quizService.persistQuiz(new QuizEntity(questionGroup));

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
        console.log('HomeComponent: SetQuiz failed', error);
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
      } else {
        this.isQueryingQuizState = false;
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
    this.isQueryingQuizState = false;
  }

  private selectQuizAsDemoQuiz(): void {
    this.isAddingDemoQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
    this.isQueryingQuizState = false;
  }

  private selectQuizAsAbcdQuiz(): void {
    this.isAddingABCDQuiz = true;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
    this.isQueryingQuizState = false;
  }

  private selectQuizAsDefaultQuiz(quizName: string): void {
    this.quizApiService.getQuizStatus(quizName).subscribe(value => {
      this.isQueryingQuizState = false;

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
    if (this.quizService.quiz && this.attendeeService.ownNick) {
      this.memberApiService.deleteMember(this.quizService.quiz.name, this.attendeeService.ownNick).subscribe();
    }
    this.attendeeService.cleanUp();
    this.quizService.cleanUp();
    this.connectionService.cleanUp();
    sessionStorage.removeItem(StorageKey.CurrentQuizName);
    sessionStorage.removeItem(StorageKey.CurrentNickName);
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.delete(DbTable.Config, StorageKey.QuizTheme).subscribe();
    }
    if (!environment.persistQuizzes && !this.userService.isAuthorizedFor(UserRole.QuizAdmin)) {
      this.storageService.getAll<QuizEntity>(DbTable.Quiz).pipe(takeUntil(this._destroy)).subscribe(quizDbData => {
        quizDbData.forEach(quizData => {
          this.quizApiService.deleteQuiz(quizData.value).subscribe(() => {
            this.storageService.delete(DbTable.Quiz, quizData.id).subscribe();
          }, () => {
            this.storageService.delete(DbTable.Quiz, quizData.id).subscribe();
          });
        });
      });
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
