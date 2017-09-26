import {Component, OnInit} from '@angular/core';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AvailableQuizzesComponent} from '../../modals/available-quizzes/available-quizzes.component';
import {ThemesService} from '../../service/themes.service';
import {questionGroupReflection} from '../../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../../lib/questions/interfaces';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../service/settings.service';
import {NotYetImplementedException} from '../../../lib/exceptions/not-yet-implemented-exception';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {IMessage} from '../../quiz-flow/quiz-lobby/quiz-lobby.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  get provideNickSelection(): boolean {
    return this._provideNickSelection;
  }
  public canJoinQuiz = false;
  public canAddQuiz = false;
  public canEditQuiz = false;
  public isAddingDemoQuiz = false;
  public isAddingABCDQuiz = false;
  public enteredSessionName = '';

  private _httpApiEndpoint = DefaultSettings.httpApiEndpoint;
  private _provideNickSelection = false;

  constructor(private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private modalService: NgbModal,
              private activeQuestionGroupService: ActiveQuestionGroupService,
              private themesService: ThemesService,
              private http: HttpClient,
              private router: Router,
              private currentQuiz: CurrentQuizService) {
    this.activeQuestionGroupService.activeQuestionGroup = null;
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
  }

  ngOnInit(): void {
    this.themesService.updateCurrentlyUsedTheme();
  }

  parseQuiznameInput(event: any) {
    const quizname = event.target.value.trim();
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
            const quizExists: boolean = value.status === 'STATUS:SUCCESS' && value.step === 'QUIZ:AVAILABLE';
            this.canAddQuiz = !quizExists;
            this.canJoinQuiz = quizExists;
            if (quizExists) {
              this._provideNickSelection = value.payload.provideNickSelection;
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
      this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
      this.activeQuestionGroupService.persist();
      this.router.navigate(routingTarget);
    });
  }
}
