import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AvailableQuizzesComponent} from '../../modals/available-quizzes/available-quizzes.component';
import {ThemesService} from '../../service/themes.service';
import {questionGroupReflection} from '../../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../../lib/questions/interfaces';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings, SettingsService} from '../../service/settings.service';
import {NotYetImplementedException} from '../../../lib/exceptions/not-yet-implemented-exception';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {IMessage} from '../../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {I18nService, Languages} from '../../service/i18n.service';
import {Subscription} from 'rxjs/Subscription';
import {AttendeeService} from '../../service/attendee.service';
import {ConnectionService} from '../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {IMathjaxResponse} from 'lib/common.interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  get provideNickSelection(): boolean {
    return this._provideNickSelection;
  }

  public canJoinQuiz = false;
  public canAddQuiz = false;
  public canEditQuiz = false;
  public passwordRequired = false;
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName = '';
  public mathjax = '';

  private _httpApiEndpoint = DefaultSettings.httpApiEndpoint;
  private _provideNickSelection = false;
  private _routerSubscription: Subscription;
  private _serverPassword = '';

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private modalService: NgbModal,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private http: HttpClient,
    private router: Router,
    private themesService: ThemesService,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.setHeaderLabel('default');
    const ownedQuizzes = window.localStorage.getItem('config.owned_quizzes');
    if (ownedQuizzes && JSON.parse(ownedQuizzes).length > 0) {
      this.modalService.open(AvailableQuizzesComponent);
    }
    this.connectionService.initConnection().then(() => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/mathjax/example/third`).subscribe(
        (result: IMathjaxResponse) => {
          this.mathjax = result.svg;
        });
      this.connectionService.initConnection().then(() => {
        this.connectionService.socket.subscribe(
          (data: IMessage) => {
            this.connectionService.websocketAvailable = true;
          },
          () => {
            this.connectionService.websocketAvailable = false;
          },
          () => {
            this.connectionService.websocketAvailable = false;
          }
        );
      });
    });
    this.cleanUpSessionStorage();
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  private cleanUpSessionStorage(): void {
    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this.activeQuestionGroupService.cleanUp();
      window.sessionStorage.removeItem('questionGroup');
    }
    window.sessionStorage.removeItem('config.quiz_theme');
    this.attendeeService.cleanUp();
    this.currentQuiz.cleanUp();
    this.connectionService.cleanUp();
  }

  ngOnInit(): void {
    this.themesService.updateCurrentlyUsedTheme();
    this._routerSubscription = this.route.params.subscribe(params => {
      if (!Object.keys(params).length) {
        return;
      }
      window.localStorage.setItem('config.default_theme', params.themeId);
      this.themesService.updateCurrentlyUsedTheme();
      this.i18nService.setLanguage(<Languages>params.languageId.toUpperCase());
    });
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

  parseQuiznameInput(event: any) {
    const quizname = event.target.value.trim();
    this.enteredSessionName = quizname;
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.passwordRequired = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;

    if (quizname.toLowerCase() === 'demo quiz') {
      this.isAddingDemoQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
      this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
    } else if (quizname.indexOf('abcd') > -1) {
      this.isAddingABCDQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
      this.passwordRequired = this.settingsService.serverSettings.createQuizPasswordRequired;
    } else {
      if (quizname.length > 3) {
        if ((JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || []).indexOf(quizname) > -1) {
          this.canEditQuiz = true;
        } else {
          this.http.get(`${this._httpApiEndpoint}/getAvailableQuiz/${quizname}`).subscribe((value: IMessage) => {
            if (value.status === 'STATUS:SUCCESS') {
              switch (value.step) {
                case 'QUIZ:EXISTS':
                  this.canAddQuiz = false;
                  this.canJoinQuiz = false;
                  break;
                case 'QUIZ:AVAILABLE':
                  this.canAddQuiz = false;
                  this.canJoinQuiz = true;
                  this._provideNickSelection = value.payload.provideNickSelection;
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

  joinQuiz(): void {
    this.currentQuiz.hashtag = this.enteredSessionName;
  }

  setPassword(event: Event): void {
    this._serverPassword = (<HTMLInputElement>event.target).value;
  }

  setActiveQuestionGroup(routingTarget: Array<string>): void {
    let questionGroup: IQuestionGroup;
    if (this.passwordRequired && !(this._serverPassword && this._serverPassword.length)) {
      return;
    }
    const createQuizPromise = new Promise((resolve) => {
      if (this.isAddingDemoQuiz) {
        this.http.get(`${this._httpApiEndpoint}/demoquiz/generate`).subscribe((value: any) => {
          questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
          resolve();
        });
      } else {
        questionGroup = questionGroupReflection.DefaultQuestionGroup({
          hashtag: this.enteredSessionName
        });
        if (this.isAddingABCDQuiz) {
          throw new NotYetImplementedException();
          // questionGroup.addQuestion(ABCDSingleChoiceQuestion);
        }
        resolve();
      }
    });
    createQuizPromise.then(() => {
      if (!window.localStorage.getItem('config.private_key')) {
        window.localStorage.setItem('config.private_key', this.activeQuestionGroupService.generatePrivateKey());
      }
      this.http.post(`${this._httpApiEndpoint}/quiz/reserve`, {
        quizName: this.enteredSessionName,
        privateKey: window.localStorage.getItem('config.private_key'),
        serverPassword: this._serverPassword
      }).subscribe((value: IMessage) => {
        if (value.status === 'STATUS:SUCCESSFUL') {
          this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
          this.activeQuestionGroupService.persist();
          this.router.navigate(routingTarget);
        } else {
          console.log(value);
        }
      });
    });
  }
}
