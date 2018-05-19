import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AvailableQuizzesComponent} from '../../modals/available-quizzes/available-quizzes.component';
import {ThemesService} from '../../service/themes.service';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../service/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {I18nService, Languages} from '../../service/i18n.service';
import {Subscription} from 'rxjs';
import {AttendeeService} from '../../service/attendee.service';
import {ConnectionService} from '../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ABCDSingleChoiceQuestion} from 'arsnova-click-v2-types/src/questions/question_choice_single_abcd';
import {DefaultAnswerOption} from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import {CasService} from '../../service/cas.service';
import {DefaultSettings} from '../../../lib/default.settings';
import {SessionConfiguration} from 'arsnova-click-v2-types/src/session_configuration/session_config';
import {ITrackClickEvent, TrackingService} from '../../service/tracking.service';
import {SharedService} from '../../service/shared.service';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  set isShowingQuiznameDatalist(value: boolean) {
    this._isShowingQuiznameDatalist = value;
  }
  get isShowingQuiznameDatalist(): boolean {
    return this._isShowingQuiznameDatalist;
  }
  public static TYPE = 'HomeComponent';

  get serverPassword(): string {
    return this._serverPassword;
  }
  get ownQuizzes(): Array<string> {
    return this._ownQuizzes;
  }

  get hasErrors(): string {
    return this._hasErrors;
  }
  get provideNickSelection(): boolean {
    return this._provideNickSelection;
  }

  public canJoinQuiz = false;
  public canAddQuiz = false;
  public canEditQuiz = false;
  public canStartQuiz = false;
  public passwordRequired = false;
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName = '';
  public mathjax = '';

  private _provideNickSelection = false;
  private readonly _routerSubscription: Subscription;
  private _serverPassword = '';
  private _hasErrors = '';

  private _currentlyAvailableQuizzes: Array<string> = [];
  private readonly _ownQuizzes: Array<string> = [];

  private _isShowingQuiznameDatalist = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private modalService: NgbModal,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private router: Router,
    private themesService: ThemesService,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private casService: CasService,
    private settingsService: SettingsService,
    private currentQuiz: CurrentQuizService,
    private trackingService: TrackingService,
    public sharedService: SharedService
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
    }

    this.cleanUpSessionStorage();

    this.connectionService.initConnection().then(() => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/mathjax/example/third`).subscribe(
      (result: string) => {
        this.mathjax = result;
      });

      this.connectionService.socket.subscribe(
        (data: IMessage) => {
          this.connectionService.websocketAvailable = true;

          switch (data.step) {
            case 'QUIZ:SET_ACTIVE':
              this.sharedService.activeQuizzes.push(data.payload.quizName);
              break;
            case 'QUIZ:SET_INACTIVE':
              const index = this.sharedService.activeQuizzes.findIndex(name => name === data.payload.quizName);
              this.sharedService.activeQuizzes.splice(index, 1);
          }
        },
        () => this.connectionService.websocketAvailable = false
      );
    });
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  private cleanUpSessionStorage(): void {
    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this.activeQuestionGroupService.cleanUp();
    }
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('config.quiz_theme');
    }
    this.attendeeService.cleanUp();
    this.currentQuiz.cleanUp();
    this.connectionService.cleanUp();
    this.currentQuizService.cleanUp();
  }

  ngOnInit(): void {
    this.themesService.updateCurrentlyUsedTheme();
  }

  ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
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

  autoJoinToSession(option): void {
    this.selectQuizByList(option);

    if (isPlatformBrowser(this.platformId)) {
      const interval = setInterval(() => {
        if (document.getElementById('joinSession').hasAttribute('disabled')) {
          return;
        } else {
          clearInterval(interval);
        }
        document.getElementById('joinSession').click();
      }, 10);
    }
  }

  showQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('hashtag-input-data-list');
      elem.classList.remove('d-none');
    }
    this.isShowingQuiznameDatalist = true;
  }

  hideQuiznameDatalist(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.getElementById('hashtag-input-data-list');
      elem.classList.add('d-none');
    }
    this.isShowingQuiznameDatalist = false;
  }

  selectQuizByName(quizname: string) {
    this.enteredSessionName = quizname;
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.canStartQuiz = false;
    this.passwordRequired = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;

    if (isPlatformBrowser(this.platformId)) {
      const currentQuizzes = JSON.parse(window.localStorage.getItem('config.owned_quizzes').toLowerCase()) || [];

      if (currentQuizzes.find(quiz => quiz === quizname.toLowerCase())) {
        const currentQuiz = JSON.parse(window.localStorage.getItem(quizname));
        const questionGroupInstance = questionGroupReflection[currentQuiz.TYPE](currentQuiz);
        this.canAddQuiz = false;
        this.canEditQuiz = true;
        this.canStartQuiz = questionGroupInstance.isValid();
        this.passwordRequired = this.canStartQuiz && this.settingsService.serverSettings.createQuizPasswordRequired;
      } else if (quizname.toLowerCase() === 'demo quiz') {
        this.isAddingDemoQuiz = true;
        this.canAddQuiz = false;
        this.canEditQuiz = false;
        this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
      } else if (this.checkABCDOrdering(quizname.toLowerCase())) {
        this.isAddingABCDQuiz = true;
        this.canAddQuiz = false;
        this.canEditQuiz = false;
        this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
      } else {
        if (quizname.length > 3) {
          this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/status/${quizname}`).subscribe((value: IMessage) => {
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
                    this.casService.quizName = quizname;
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
            } else {
              console.log(value);
            }
          });
        }
      }
    }
  }

  selectQuizByList(option: string) {
    this.hideQuiznameDatalist();
    this.selectQuizByName(option);
  }

  parseQuiznameInput(event: any) {
    this.selectQuizByName(event.target.value.trim());
  }

  setPassword(event: Event): void {
    this._serverPassword = (<HTMLInputElement>event.target).value;
  }

  handleClick(id: string): boolean {
    const trackingParams: ITrackClickEvent = {
      action: HomeComponent.TYPE,
      label: '',
      customDimensions: {
        dimension1: this.hasErrors,
        dimension2: this.passwordRequired
      }
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

  setActiveQuestionGroup(routingTarget?: Array<string>): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(
        localStorage.getItem(
          Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase())
        )
      );

      if (questionGroupSerialized) {
        this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
      }
    }

    if (routingTarget) {
      this.router.navigate(routingTarget);
    }

    return true;
  }

  async setAsCurrentQuiz(routingTarget: Array<string>) {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(
        localStorage.getItem(
          Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase())
        )
      );

      if (this.passwordRequired && !(this._serverPassword && this._serverPassword.length)) {
        return;
      }

      const questionGroup = await new Promise<IQuestionGroup>((resolve) => {
        if (this.isAddingDemoQuiz) {
          this.addDemoQuiz().then((value) => resolve(value));
        } else if (this.isAddingABCDQuiz) {
          this.addAbcdQuiz().then((value) => resolve(value));
        } else if (questionGroupSerialized) {
          resolve(questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized));
        } else {
          resolve(questionGroupReflection.DefaultQuestionGroup({
            hashtag: this.enteredSessionName,
            sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings)
          }));
        }
      });

      if (!window.localStorage.getItem('config.private_key')) {
        window.localStorage.setItem('config.private_key', this.activeQuestionGroupService.generatePrivateKey());
      }

      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/reserve`, {
        quizName: this.enteredSessionName,
        privateKey: window.localStorage.getItem('config.private_key'),
        serverPassword: this._serverPassword
      }).subscribe(async (value: IMessage) => {

        if (value.status === 'STATUS:SUCCESSFUL') {
          this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
          this.activeQuestionGroupService.persist();

          this.currentQuizService.quiz = questionGroup;
          this.currentQuizService.persistToSessionStorage();

          if (this.isAddingABCDQuiz) {
            this.trackingService.trackConversionEvent({action: HomeComponent.TYPE, label: 'ABCD Quiz created'});
          } else if (this.isAddingDemoQuiz) {
            this.trackingService.trackConversionEvent({action: HomeComponent.TYPE, label: 'Demo Quiz created'});
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
  }

  private async activateQuiz(questionGroup: IQuestionGroup) {

    return new Promise(async (resolve) => {
      this.currentQuizService.quiz = questionGroup;
      if (this.isAddingABCDQuiz || this.isAddingDemoQuiz) {
        await this.currentQuizService.cacheQuiz(questionGroup);
      }
      this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby`, {
        quiz: this.currentQuizService.quiz.serialize()
      }).subscribe(
        () => {
          resolve();
        }
      );
    });
  }

  private async addDemoQuiz(): Promise<IQuestionGroup> {
    const url = `${DefaultSettings.httpApiEndpoint}/quiz/generate/demo/${this.i18nService.currentLanguage.toString()}`;
    return new Promise<IQuestionGroup>(resolve => {
      this.http.get(url).subscribe((value: any) => {
        Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);
        const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
        this.enteredSessionName = questionGroup.hashtag;
        resolve(questionGroup);
      });
    });
  }

  private async addAbcdQuiz(): Promise<IQuestionGroup> {
    const language = this.i18nService.currentLanguage.toString();
    const answerList = this.enteredSessionName.split('');

    return new Promise<IQuestionGroup>((resolveABCDGeneration) => {
      if (isPlatformServer(this.platformId)) {
        resolveABCDGeneration();
      }

      const hasMatchedABCDQuiz = JSON.parse(window.localStorage.getItem('config.owned_quizzes')).filter(quizName => {
        return quizName.split(' ')[0] === this.enteredSessionName;
      });
      if (hasMatchedABCDQuiz.length) {
        resolveABCDGeneration();
        return;
      }
      const url = `${DefaultSettings.httpApiEndpoint}/quiz/generate/abcd/${language}/${answerList.length}`;
      this.http.get(url).subscribe((value: any) => {

        Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);

        const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
        const answerOptionList = (<Array<DefaultAnswerOption>>[]);

        answerList.forEach((character, index) => {
          answerOptionList.push(new DefaultAnswerOption({answerText: (String.fromCharCode(index + 65))}));
        });
        this.enteredSessionName = questionGroup.hashtag;
        const abcdQuestion = new ABCDSingleChoiceQuestion({
          questionText: '', timer: 60, displayAnswerText: false, answerOptionList, showOneAnswerPerRow: false
        });
        questionGroup.questionList = [abcdQuestion];
        resolveABCDGeneration(questionGroup);
      });
    });
  }
}
