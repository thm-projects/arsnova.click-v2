import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
import { Observable, of, Subscription } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { AvailableQuizzesComponent } from '../../modals/available-quizzes/available-quizzes.component';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { CasService } from '../../service/cas/cas.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService, Languages } from '../../service/i18n/i18n.service';
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
    private trackingService: TrackingService,
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
        () => this.connectionService.websocketAvailable = false,
      );
    });
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this.themesService.updateCurrentlyUsedTheme().subscribe();
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  public autoJoinToSession(quizname): Subscription {
    return new Observable<void>(subscriber => {
      of(this.selectQuizByList(quizname)).subscribe(() => subscriber.complete());

      if (isPlatformServer(this.platformId)) {
        return;
      }

      const interval = setInterval(() => {
        if (document.getElementById('joinSession').hasAttribute('disabled')) {
          return;
        } else {
          clearInterval(interval);
        }
        document.getElementById('joinSession').click();
      }, 10);
    }).subscribe();
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

  public selectQuizByList(quizname: string): Subscription {
    return new Observable<void>(subscriber => {
      this.hideQuiznameDatalist();
      console.log('selectquizbyname call');
      this.selectQuizByName(quizname).subscribe(() => {
        console.log('selectquizbyname returns');
        subscriber.complete();
      });
    }).subscribe();
  }

  public parseQuiznameInput(event: any): void {
    this.selectQuizByName(event.target.value.trim()).subscribe();
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

  public setActiveQuestionGroup(routingTarget?: Array<string>): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(
        localStorage.getItem(
          Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase()),
        ),
      );

      if (questionGroupSerialized) {
        this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](
          questionGroupSerialized,
        );
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
      localStorage.getItem(
        Object.keys(localStorage).find(name => name.toLowerCase() === this.enteredSessionName.toLowerCase()),
      ),
    );

    if (this.passwordRequired && !(this._serverPassword && this._serverPassword.length)) {
      return;
    }

    const questionGroup = await new Promise<IQuestionGroup>((resolve) => {
      if (this.isAddingDemoQuiz) {
        this.addDemoQuiz().subscribe((value) => resolve(value));
      } else if (this.isAddingABCDQuiz) {
        this.addAbcdQuiz().subscribe((value) => resolve(value));
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

    this.reserveQuiz(questionGroup, routingTarget).subscribe();
  }

  private reserveQuiz(questionGroup, routingTarget): Observable<IMessage> {
    return new Observable<IMessage>(subscriber => {
      this.http.post<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/reserve`, {
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
            this.trackingService.trackConversionEvent({ action: HomeComponent.TYPE, label: 'ABCD Quiz created' });
          } else if (this.isAddingDemoQuiz) {
            this.trackingService.trackConversionEvent({ action: HomeComponent.TYPE, label: 'Demo Quiz created' });
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

        subscriber.next(value);
      });
    });
  }

  private selectQuizByName(quizname: string): Observable<void> {
    this.enteredSessionName = quizname;
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

    if (currentQuizzes.find(quiz => quiz === quizname.toLowerCase())) {
      return of(this.selectQuizAsExisting(quizname));
    } else if (quizname.toLowerCase() === 'demo quiz') {
      return of(this.selectQuizAsDemoQuiz());
    } else if (this.checkABCDOrdering(quizname.toLowerCase())) {
      return of(this.selectQuizAsAbcdQuiz());
    } else {
      if (quizname.length > 3) {
        return this.selectQuizAsDefaultQuiz(quizname);
      }
      return of(null);
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

  private selectQuizAsDefaultQuiz(quizname): Observable<any> {
    return new Observable<any>(subscriber => {
      console.log('http start');
      subscriber.next(of(
        this.http.get<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/status/${quizname}`).subscribe(value => {
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
                  this.casService.quizName = quizname;
                }
                break;
              case 'QUIZ:UNDEFINED':
                this.canAddQuiz = true;
                this.canJoinQuiz = false;
                this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
                break;
              default:
                subscriber.error(value);
            }
          } else {
            subscriber.error(value);
          }
        }),
      ));
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

    return new Observable<IMessage>(subscriber => {
      (async () => {
        this.currentQuizService.quiz = questionGroup;
        if (this.isAddingABCDQuiz || this.isAddingDemoQuiz) {
          this.currentQuizService.cacheQuiz();
        }

        this.http.put<IMessage>(`${DefaultSettings.httpApiEndpoint}/lobby`, {
          quiz: this.currentQuizService.quiz.serialize(),
        }).subscribe(
          (data) => {
            subscriber.next(data);
          },
        );
      })();
    });
  }

  private addDemoQuiz(): Observable<IQuestionGroup> {
    const url = `${DefaultSettings.httpApiEndpoint}/quiz/generate/demo/${this.i18nService.currentLanguage.toString()}`;
    return new Observable<IQuestionGroup>(subscriber => {
      this.http.get(url).subscribe((value: any) => {
        Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);
        const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
        this.enteredSessionName = questionGroup.hashtag;
        subscriber.next(questionGroup);
      });
    });
  }

  private addAbcdQuiz(): Observable<IQuestionGroup> {
    const language = this.i18nService.currentLanguage.toString();
    const answerList = this.enteredSessionName.split('');

    return new Observable<IQuestionGroup>(subscriber => {
      if (isPlatformServer(this.platformId)) {
        subscriber.complete();
        return;
      }

      const hasMatchedABCDQuiz = JSON.parse(window.localStorage.getItem('config.owned_quizzes')).filter(quizName => {
        return quizName.split(' ')[0] === this.enteredSessionName;
      });
      if (hasMatchedABCDQuiz.length) {
        const rawQuiz = JSON.parse(window.localStorage.getItem(hasMatchedABCDQuiz[0]));
        const questionGroup = questionGroupReflection.DefaultQuestionGroup(rawQuiz);
        const answerOptionList = (<Array<DefaultAnswerOption>>[]);

        answerList.forEach((character, index) => {
          answerOptionList.push(new DefaultAnswerOption({ answerText: (String.fromCharCode(index + 65)) }));
        });
        this.enteredSessionName = questionGroup.hashtag;
        const abcdQuestion = new ABCDSingleChoiceQuestion({
          questionText: '', timer: 60, displayAnswerText: false, answerOptionList, showOneAnswerPerRow: false,
        });
        questionGroup.questionList = [abcdQuestion];
        subscriber.next(questionGroup);
        return;
      }
      const url = `${DefaultSettings.httpApiEndpoint}/quiz/generate/abcd/${language}/${answerList.length}`;
      this.http.get(url).subscribe((value: any) => {

        Object.assign(value.sessionConfig, DefaultSettings.defaultQuizSettings);

        const questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
        const answerOptionList = (<Array<DefaultAnswerOption>>[]);

        answerList.forEach((character, index) => {
          answerOptionList.push(new DefaultAnswerOption({ answerText: (String.fromCharCode(index + 65)) }));
        });
        this.enteredSessionName = questionGroup.hashtag;
        const abcdQuestion = new ABCDSingleChoiceQuestion({
          questionText: '', timer: 60, displayAnswerText: false, answerOptionList, showOneAnswerPerRow: false,
        });
        questionGroup.questionList = [abcdQuestion];
        subscriber.next(questionGroup);
      });
    });
  }
}
