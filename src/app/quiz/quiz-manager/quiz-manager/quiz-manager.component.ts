import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { availableQuestionTypes } from '../../../lib/available-question-types';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { getDefaultQuestionForType } from '../../../lib/QuizValidator';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { NotificationService } from '../../../service/notification/notification.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { QuizTypeSelectModalComponent } from './quiz-type-select-modal/quiz-type-select-modal.component';

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  public static readonly TYPE = 'QuizManagerComponent';

  private _hiddenQuestionBodies: Array<AbstractQuestionEntity> = [];
  private readonly _destroy = new Subject();

  public readonly revalidate = new Subject<void>();
  public isLoaded: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public quizService: QuizService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private hotkeysService: HotkeysService,
    private i18nService: I18nService
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.TYPE_REFERENCE = QuizManagerComponent.TYPE;

    const footerElements = [
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemMemberGroup,
      this.footerBarService.footerElemSound,
      this.footerBarService.footerElemHotkeys,
      this.footerBarService.footerElemHashtagManagement
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
        this.quizService.loadDataToPlay(updatedQuiz.name);
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

    this.quizService.close().subscribe();

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.isLoaded = true;
      this.cdRef.markForCheck();

      const memberGroupInvalid = this.quizService.quiz.sessionConfig.nicks.memberGroups.length === 1;
      this.footerBarService.footerElemMemberGroup.iconClass = ['fas', memberGroupInvalid ? 'exclamation-triangle' : 'users'];
      this.notificationService.footerBadges[this.footerBarService.footerElemMemberGroup.id] = memberGroupInvalid ? '!' : null;
    }).catch(() => {});

    this.revalidate.pipe(takeUntil(this._destroy)).subscribe(() => {
      this.cdRef.markForCheck();
    });
  }

  public ngAfterViewInit(): void {
    this.i18nService.initialized.pipe(takeUntil(this._destroy)).subscribe(this.loadHotkeys.bind(this));
    this.translateService.onLangChange.pipe(takeUntil(this._destroy)).subscribe(this.loadHotkeys.bind(this));
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();

    this._destroy.next();
    this._destroy.complete();

    this.hotkeysService.reset();
    this.hotkeysService.hotkeys = [];
    this.hotkeysService.cheatSheetToggle.next(false);

    if (isPlatformBrowser(this.platformId) && window['hs']) {
      window['hs'].close();
    }
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

  public hasAllQuestionBodiesHidden(): boolean {
    return this._hiddenQuestionBodies.length === this.quizService.quiz?.questionList.length;
  }

  public hideQuestionBody(elem?: AbstractQuestionEntity): void {
    if (elem) {
      this._hiddenQuestionBodies.push(elem);
    } else {
      this._hiddenQuestionBodies = this.quizService.quiz?.questionList;
    }
    this.revalidate.next();
    this.cdRef.markForCheck();
  }

  public showQuestionBody(elem?: AbstractQuestionEntity): void {
    if (elem) {
      if (this._hiddenQuestionBodies.indexOf(elem) > -1) {
        this._hiddenQuestionBodies = this._hiddenQuestionBodies.filter(value => value !== elem);
      }
    } else {
      this._hiddenQuestionBodies = [];
    }
    this.revalidate.next();
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

  public hasQuestionBodyHidden(elem: AbstractQuestionEntity): boolean {
    return this._hiddenQuestionBodies.includes(elem);
  }

  public toggleQuestionBody(elem?: AbstractQuestionEntity): void {
    if (!elem) {
      if (this.hasAllQuestionBodiesHidden()) {
        this.showQuestionBody();
      } else {
        this.hideQuestionBody();
      }
      return;
    }

    if (this.hasQuestionBodyHidden(elem)) {
      this.showQuestionBody(elem);
    } else {
      this.hideQuestionBody(elem);
    }
  }

  public moveQuestionAllDown(id: number): void {
    if (id === this.quizService.quiz.questionList.length - 1) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-all-down`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, this.quizService.quiz.questionList.length);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  public moveQuestionAllUp(id: number): void {
    if (!id) {
      return;
    }

    const question = this.quizService.quiz.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-all-up`,
    });
    this.quizService.quiz.removeQuestion(id);
    this.quizService.quiz.addQuestion(question, 0);
    this.quizService.persist();
    this.cdRef.markForCheck();
  }

  private addQuestion(id: QuestionType): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `add-question`,
    });
    const question = getDefaultQuestionForType(this.translateService, id);
    this.quizService.quiz.addQuestion(question);
    this.quizService.persist();
    this.router.navigate(['/quiz', 'manager', this.quizService.quiz.questionList.length - 1, 'overview']);
  }

  private loadHotkeys(): void {
    this.hotkeysService.hotkeys = [];
    this.hotkeysService.reset();

    availableQuestionTypes.filter(type => {
      return ![
        QuestionType.ABCDSurveyQuestion,
        QuestionType.YesNoSingleChoiceQuestion,
        QuestionType.TrueFalseSingleChoiceQuestion,
      ].includes(type.id);
    }).forEach((type, index) => {
      this.hotkeysService.add(new Hotkey('ctrl+' + (index + 1), (): boolean => {
        this.addQuestion(type.id);
        return false;
      }, undefined, this.translateService.instant(type.descriptionHotkey)));
    });
  }
}
