import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AvailableQuizzesComponent} from '../../modals/available-quizzes/available-quizzes.component';
import {ThemesService} from '../../service/themes.service';
import {questionGroupReflection} from '../../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../../lib/questions/interfaces';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DefaultSettings} from '../../service/settings.service';
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
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName = '';
  public mathjax = '';

  private _httpApiEndpoint = DefaultSettings.httpApiEndpoint;
  private _provideNickSelection = false;
  private _routerSubscription: Subscription;

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
    private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemAbout,
      FooterBarComponent.footerElemTranslation,
      FooterBarComponent.footerElemTheme,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemHashtagManagement,
      FooterBarComponent.footerElemImport,
    ]);
    headerLabelService.setHeaderLabel('default');
    const ownedQuizzes = window.localStorage.getItem('owned_quizzes');
    if (ownedQuizzes && JSON.parse(ownedQuizzes).length > 0) {
      this.modalService.open(AvailableQuizzesComponent);
    }
    this.connectionService.initConnection().then(() => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/mathjax/example/third`).subscribe(
        (result: IMathjaxResponse) => {
        const style = document.createElement('style');
        style.innerHTML = result.css;
        document.getElementsByClassName('mathjax-css-container').item(0).appendChild(style);
        this.mathjax = result.html;
      });
      this.connectionService.socket.subscribe(
        (data: IMessage) => {
          if (data.payload.id) {
            window.sessionStorage.setItem('webSocket', data.payload.id);
            this.connectionService.websocketAvailable = true;
          }
        },
        () => {
          this.connectionService.websocketAvailable = false;
        },
        () => {
          this.connectionService.websocketAvailable = false;
        }
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
      window.sessionStorage.removeItem('questionGroup');
    }
    window.sessionStorage.removeItem('quiz_theme');
    window.sessionStorage.removeItem('webSocket');
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
      window.localStorage.setItem('defaultTheme', params.themeId);
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
    this.isAddingDemoQuiz = false;
    this.isAddingABCDQuiz = false;

    if (quizname.toLowerCase() === 'demo quiz') {
      this.isAddingDemoQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
    } else if (quizname.indexOf('abcd') > -1) {
      this.isAddingABCDQuiz = true;
      this.canAddQuiz = false;
      this.canEditQuiz = false;
    } else {
      if (quizname.length > 3) {
        if ((JSON.parse(window.localStorage.getItem('owned_quizzes')) || []).indexOf(quizname) > -1) {
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

  setActiveQuestionGroup(routingTarget: Array<string>): void {
    let questionGroup: IQuestionGroup;
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
      if (!window.localStorage.getItem('privateKey')) {
        window.localStorage.setItem('privateKey', this.activeQuestionGroupService.generatePrivateKey());
      }
      this.http.post(`${this._httpApiEndpoint}/quiz/reserve`, {
        quizName: this.enteredSessionName,
        privateKey: window.localStorage.getItem('privateKey')
      }).subscribe((value: any) => {
      });
      this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
      this.activeQuestionGroupService.persist();
      this.router.navigate(routingTarget);
    });
  }
}
