import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { MessageProtocol, StatusProtocol } from '../../lib/enums/Message';
import { UserRole } from '../../lib/enums/UserRole';
import { QuizSaveComponent } from '../../modals/quiz-save/quiz-save.component';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: ['./quiz-overview.component.scss'],
})
export class QuizOverviewComponent implements OnInit {
  public static readonly TYPE = 'QuizOverviewComponent';

  private _sessions: Array<QuizEntity> = [];
  private _isSaving: Array<string> = [];

  public publicQuizAmount: number;
  public isStartingQuiz: QuizEntity;
  public isDeletingQuiz: QuizEntity;
  public searchText: string;

  get sessions(): Array<QuizEntity> {
    return this._sessions;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private router: Router,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private storageService: StorageService,
    private userService: UserService,
    private modalService: NgbModal,
    public connectionService: ConnectionService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizOverviewComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
    ]);

    headerLabelService.headerLabel = 'component.name_management.session_management';

    if (isPlatformBrowser(this.platformId)) {
      this.quizApiService.getPublicQuizAmount().subscribe(val => {
        this.publicQuizAmount = val;
      });
    }
  }

  public startQuiz(elem: QuizEntity): Promise<void> {
    this.isStartingQuiz = elem;
    return new Promise(async resolve => {
      if (isPlatformServer(this.platformId)) {
        resolve();
        return;
      }

      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `start-quiz`,
      });

      const quizAvailable = await this.requestQuizStatus(elem);
      if (!quizAvailable) {
        this.isStartingQuiz = null;
        resolve();
        return;
      }

      this.quizApiService.putSavedQuiz(elem).subscribe(async () => {
        this.quizService.quiz = elem;
        this.quizService.isOwner = true;
        this.quizService.persist();

        this.quizApiService.setQuiz(this.quizService.quiz).subscribe((updatedQuiz) => {
          this.quizService.quiz = new QuizEntity(updatedQuiz);
          this.router.navigate(['/quiz', 'flow']);
        }, () => {}, () => {
          resolve();
        });
      });
    });
  }

  public editQuiz(quiz: QuizEntity): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `edit-quiz`,
    });

    this.quizService.quiz = quiz;
    this.quizService.isOwner = true;
    this.router.navigate(['/quiz', 'manager', 'overview']);
  }

  public async exportQuiz(quiz: QuizEntity, onClick?: (self: HTMLAnchorElement, event: MouseEvent) => void): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const a = document.createElement('a');
    const time = new Date();
    const type = 'text/json';
    const sessionName = quiz.name;
    const exportData = `${type};charset=utf-8,${encodeURIComponent(JSON.stringify(quiz))}`;
    const timestring = time.getDate() + '_' + (time.getMonth() + 1) + '_' + time.getFullYear();
    const fileName = `${sessionName}-${timestring}.json`;

    a.href = 'data:' + exportData;
    a.download = fileName;
    a.addEventListener<'click'>('click', function (this: HTMLAnchorElement, event: MouseEvent): void {
      if (onClick) {
        onClick(this, event);
      }
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(new Blob([exportData], { type }), fileName);
      }
    });
    a.innerHTML = '';
    a.click();

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `export-quiz`,
    });
  }

  public deleteQuiz(elem: QuizEntity): void {
    this.isDeletingQuiz = elem;
    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `delete-quiz`,
    });

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizApiService.deleteQuiz(elem).subscribe(response => {
      if (response.status !== StatusProtocol.Success) {
        console.log('QuizOverviewComponent: DeleteQuiz failed', response);
        return;
      }

      const sessionName = elem.name;
      this.storageService.db.Quiz.delete(sessionName).then(() => {
        const index = this.sessions.findIndex(quiz => quiz.name === sessionName);
        if (index > -1) {
          this.sessions.splice(index, 1);
        }
      });
    });
  }

  public ngOnInit(): void {
    this.loadData();
  }

  public isSaved(quiz: QuizEntity): boolean {
    return this._isSaving.includes(quiz.name);
  }

  public saveQuiz(quiz: QuizEntity): void {
    if (this.isSaved(quiz)) {
      return;
    }

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `save-quiz`,
    });

    this.modalService.open(QuizSaveComponent).result.catch(() => {}).then(val => {
      if (!val || (
        val.expiry && new Date(val.expiry).getTime() <= new Date().getTime()
      )) {
        return;
      }

      const index = this.sessions.findIndex(v => v.name === quiz.name);

      this.sessions[index].expiry = val.expiry ? new Date(val.expiry) : null;
      this.sessions[index].visibility = val.visibility;
      this.sessions[index].description = val.description;
      this._isSaving.push(quiz.name);

      this.storageService.db.Quiz.put(this.sessions[index]);
      this.quizApiService.putSavedQuiz(this.sessions[index]).subscribe(() => {
        this._isSaving.splice(this._isSaving.indexOf(quiz.name), 1);
      }, () => {
        this._isSaving.splice(this._isSaving.indexOf(quiz.name), 1);
      });
    });
  }

  public isAuthorizedToSaveQuiz(): boolean {
    return this.userService.isAuthorizedFor([UserRole.CreateExpiredQuiz, UserRole.SuperAdmin]);
  }

  public isAuthorizedToModifyQuiz(): boolean {
    return !environment.requireLoginToCreateQuiz || this.userService.isAuthorizedFor(UserRole.QuizAdmin);
  }

  public getUniqueTags(elem: QuizEntity): Array<string> {
    return this.arrayUnique(this.getTags(elem));
  }

  public getQuizLink(quizName: string): string {
    return encodeURI(`${document.location.origin}/quiz/${quizName}`);
  }

  public copyQuizLink(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  private loadData(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.db.Quiz.toCollection().each(session => this._sessions.push(new QuizEntity(session)));
    }
  }

  private async requestQuizStatus(session: QuizEntity): Promise<boolean> {
    const quizStatusResponse = await this.quizApiService.getQuizStatus(session.name).toPromise();
    return [MessageProtocol.Editable, MessageProtocol.Unavailable].includes(quizStatusResponse.step);
  }

  private getTags(elem: QuizEntity): Array<string> {
    return elem?.questionList?.reduce((previousValue, currentValue) => previousValue.concat(...(currentValue.tags || [])), []);
  }

  private arrayUnique<T>(value: Array<T>): Array<T> {
    return value.filter((elem, index, array) => array.indexOf(elem) === index);
  }
}
