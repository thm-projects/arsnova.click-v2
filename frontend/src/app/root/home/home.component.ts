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
import {SettingsService} from '../../service/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {IMessage} from '../../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {I18nService, Languages} from '../../service/i18n.service';
import {Subscription} from 'rxjs/Subscription';
import {AttendeeService} from '../../service/attendee.service';
import {ConnectionService} from '../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ABCDSingleChoiceQuestion} from '../../../lib/questions/question_choice_single_abcd';
import {DefaultAnswerOption} from '../../../lib/answeroptions/answeroption_default';
import {CasService} from '../../service/cas.service';
import {DefaultSettings} from '../../../lib/default.settings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  get hasErrors(): string {
    return this._hasErrors;
  }
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

  private _provideNickSelection = false;
  private _routerSubscription: Subscription;
  private _serverPassword = '';
  private _hasErrors = '';

  constructor(
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
    private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.headerLabel = 'default';
    const ownedQuizzes = window.localStorage.getItem('config.owned_quizzes');
    if (ownedQuizzes && JSON.parse(ownedQuizzes).length > 0) {
      this.modalService.open(AvailableQuizzesComponent);
    }
    this.connectionService.initConnection().then(() => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/mathjax/example/third`).subscribe(
        (result: string) => {
          this.mathjax = result;
        });
      this.connectionService.socket.subscribe(
        () => this.connectionService.websocketAvailable = true,
        () => this.connectionService.websocketAvailable = false
      );
    });
    this.cleanUpSessionStorage();
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  private cleanUpSessionStorage(): void {
    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this.activeQuestionGroupService.cleanUp();
    }
    window.sessionStorage.removeItem('config.quiz_theme');
    this.attendeeService.cleanUp();
    this.currentQuiz.cleanUp();
    this.connectionService.cleanUp();
    this.currentQuizService.cleanUp();
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

  parseQuiznameInput(event: any) {
    const quizname = event.target.value.trim();
    this.enteredSessionName = quizname;
    this.canJoinQuiz = false;
    this.canAddQuiz = false;
    this.canEditQuiz = false;
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;

    if (quizname.toLowerCase() === 'demo quiz') {
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
        if ((JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || []).indexOf(quizname) > -1) {
          this.canEditQuiz = true;
        } else {
          this.http.get(`${DefaultSettings.httpApiEndpoint}/getAvailableQuiz/${quizname}`).subscribe((value: IMessage) => {
            if (value.status === 'STATUS:SUCCESS') {
              switch (value.step) {
                case 'QUIZ:EXISTS':
                  this.canAddQuiz = false;
                  this.canJoinQuiz = false;
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
        const url = `${DefaultSettings.httpApiEndpoint}/demoquiz/generate/${this.i18nService.currentLanguage.toString()}`;
        this.http.get(url).subscribe((value: any) => {
          questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
          this.enteredSessionName = questionGroup.hashtag;
          resolve();
        });
      } else if (this.isAddingABCDQuiz) {
        const language = this.i18nService.currentLanguage.toString();
        const answerList = this.enteredSessionName.split('');
        new Promise((resolveABCDGeneration) => {
          const hasMatchedABCDQuiz = JSON.parse(window.localStorage.getItem('config.owned_quizzes')).filter(quizName => {
            return quizName.split(' ')[0] === this.enteredSessionName;
          });
          if (hasMatchedABCDQuiz.length) {
            resolveABCDGeneration();
            return;
          }
          const url = `${DefaultSettings.httpApiEndpoint}/abcdquiz/generate/${language}/${answerList.length}`;
          this.http.get(url).subscribe((value: any) => {
            questionGroup = questionGroupReflection.DefaultQuestionGroup(value);
            const answerOptionList = (<Array<DefaultAnswerOption>>[]);
            answerList.forEach((character, index) => {
              answerOptionList.push(new DefaultAnswerOption({answerText: (String.fromCharCode(index + 65))}));
            });
            this.enteredSessionName = questionGroup.hashtag;
            const abcdQuestion = new ABCDSingleChoiceQuestion({
              questionText: '', timer: 60, displayAnswerText: false, answerOptionList, showOneAnswerPerRow: false
            });
            questionGroup.questionList = [abcdQuestion];
            resolveABCDGeneration();
          });
        }).then(() => {
          resolve();
        });
      } else {
        questionGroup = questionGroupReflection.DefaultQuestionGroup({
          hashtag: this.enteredSessionName
        });
        resolve();
      }
    });
    createQuizPromise.then(() => {
      if (!window.localStorage.getItem('config.private_key')) {
        window.localStorage.setItem('config.private_key', this.activeQuestionGroupService.generatePrivateKey());
      }
      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/reserve`, {
        quizName: this.enteredSessionName,
        privateKey: window.localStorage.getItem('config.private_key'),
        serverPassword: this._serverPassword
      }).subscribe((value: IMessage) => {
        if (value.status === 'STATUS:SUCCESSFUL') {
          this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
          this.activeQuestionGroupService.persist();

          new Promise((resolve) => {
            if (this.isAddingABCDQuiz || this.isAddingDemoQuiz) {
              this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby`, {
                quiz: questionGroup.serialize()
              }).subscribe(
                () => {
                  resolve();
                }
              );
            } else {
              resolve();
            }
          }).then(() => {
            this.currentQuizService.quiz = questionGroup;
            this.router.navigate(routingTarget);
          });
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
    });
  }
}
