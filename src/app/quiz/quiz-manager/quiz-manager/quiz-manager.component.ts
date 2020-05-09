import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractChoiceQuestionEntity } from '../../../lib/entities/question/AbstractChoiceQuestionEntity';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { getDefaultQuestionForType } from '../../../lib/QuizValidator';
import { QuizPoolApiService } from '../../../service/api/quiz-pool/quiz-pool-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { QuizTypeSelectModalComponent } from './quiz-type-select-modal/quiz-type-select-modal.component';

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizManagerComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizManagerComponent';

  private readonly _destroy = new Subject();
  private _uploading: Array<AbstractQuestionEntity> = [];
  private _hiddenQuestionBodies: Array<AbstractQuestionEntity> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public quizService: QuizService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private connectionService: ConnectionService,
    private modalService: NgbModal,
    private quizPoolApiService: QuizPoolApiService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.TYPE_REFERENCE = QuizManagerComponent.TYPE;

    const footerElements = [
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemMemberGroup,
      this.footerBarService.footerElemSound,
    ];
    if (environment.forceQuizTheme) {
      footerElements.push(this.footerBarService.footerElemTheme);
    }
    footerBarService.replaceFooterElements(footerElements);

    this.footerBarService.footerElemStartQuiz.onClickCallback = (self: FooterbarElement) => {
      if (!self.isActive) {
        return;
      }
      self.isLoading = true;
      this.quizApiService.setQuiz(this.quizService.quiz).subscribe(updatedQuiz => {
        this.quizService.quiz = updatedQuiz;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
        self.isLoading = false;
      });
    };
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.cdRef.markForCheck();
    }).catch(() => {});
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();
    this._destroy.next();
    this._destroy.complete();
  }

  public addQuestion(id: QuestionType): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `add-question`,
    });
    const question = getDefaultQuestionForType(this.translateService, id);
    this.quizService.quiz.addQuestion(question);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  public moveQuestionUp(id: number): void {
    if (!id) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-up`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, id - 1);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  public moveQuestionDown(id: number): void {
    if (id === this.quizService.quiz.questionList.length - 1) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-down`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, id + 1);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  public deleteQuestion(id: number): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `delete-question`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  public trackEditQuestion(): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `edit-question`,
    });
    this.cdRef.markForCheck();
  }

  public openQuestionTypeModal(): void {
    const instance = this.modalService.open(QuizTypeSelectModalComponent, {
      size: (
        'lg'
      ),
    });
    instance.result.catch(() => {}).then(id => {
      if (!id) {
        return;
      }

      this.addQuestion(id);
      this.cdRef.markForCheck();
    });
  }

  public updloadToQuizPool(elem: AbstractQuestionEntity): void {
    if (!elem.isValid() || !elem.tags?.length || this.isUploading(elem)) {
      return;
    }

    const removeQuestionFromUploadingQueue = () => {
      const uploadingIndex = this._uploading.indexOf(elem);
      if (uploadingIndex === -1) {
        return;
      }

      this._uploading.splice(uploadingIndex, 1);
      this.cdRef.markForCheck();
    };

    this._uploading.push(elem);
    this.cdRef.markForCheck();
    this.quizPoolApiService.postNewQuestion(elem, `${this.quizService.quiz.name}`).subscribe({
      complete: removeQuestionFromUploadingQueue,
      error: removeQuestionFromUploadingQueue,
    });
  }

  public isUploading(elem: AbstractQuestionEntity): boolean {
    return this._uploading.indexOf(elem) > -1;
  }

  public getTooltipForUpload(elem: AbstractQuestionEntity): string {
    return !elem.isValid() ? //
           'component.quiz_summary.upload-to-pool.invalid-question' : //
           !elem.tags?.length ? //
           'component.quiz_summary.upload-to-pool.no-tags' : //
           'component.quiz_summary.upload-to-pool.valid-upload';
  }

  public renderQuestiontext(questionText: string): Observable<SafeHtml> {
    // sanitizer.bypassSecurityTrustHtml is required for highslide
    return this.questionTextService.change(questionText).pipe(map(value => this.sanitizer.bypassSecurityTrustHtml(value)));
  }

  public isChoiceQuestion(elem: AbstractQuestionEntity): boolean {
    return elem instanceof AbstractChoiceQuestionEntity;
  }

  public hideQuestionBody(elem?: AbstractQuestionEntity): void {
    if (elem) {
      this._hiddenQuestionBodies.push(elem);
    } else {
      if (this.quizService.quiz?.questionList) {
        this._hiddenQuestionBodies = this.quizService.quiz.questionList;
      }
    }
  }

  public showQuestionBody(elem?: AbstractQuestionEntity): void {
    if (elem) {
      if (this._hiddenQuestionBodies.indexOf(elem) > -1) {
        this._hiddenQuestionBodies = this._hiddenQuestionBodies.filter(value => value !== elem);
      }
    } else {
      this._hiddenQuestionBodies = [];
    }
  }

  public hasQuestionBodyHidden(elem: AbstractQuestionEntity): boolean {
    return this._hiddenQuestionBodies.includes(elem);
  }

  public hasAllQuestionBodiesHidden(): boolean {
    if (this.quizService.quiz?.questionList) {
      return this._hiddenQuestionBodies.length === this.quizService.quiz.questionList.length;
    }
  }

  public toggleQuestionBody(elem: AbstractQuestionEntity): void {
    if (this.hasQuestionBodyHidden(elem)) {
      this.showQuestionBody(elem);
    } else {
      this.hideQuestionBody(elem);
    }
  }
}
