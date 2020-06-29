import { isPlatformServer } from '@angular/common';
import { Directive, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { QuizPoolApiService } from '../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { NotificationService } from '../../../service/notification/notification.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { StorageService } from '../../../service/storage/storage.service';

@Directive()
export abstract class AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  private _queryParams: Params = {};
  protected _isQuizPool: boolean;
  private readonly _destroy = new Subject();

  protected initialized$ = new ReplaySubject(1);
  protected _question: AbstractQuestionEntity;
  protected _questionIndex: number;

  public showSaveQuizButton = false;

  get queryParams(): Params {
    return this._queryParams;
  }

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  get destroy(): Subject<any> {
    return this._destroy;
  }

  protected constructor(
    protected platformId: Object,
    public quizService: QuizService,
    private headerLabelService: HeaderLabelService,
    protected footerBarService: FooterBarService,
    protected quizPoolApiService: QuizPoolApiService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected hotkeysService: HotkeysService,
    protected translate: TranslateService,
    protected i18nService: I18nService,
    protected storageService?: StorageService,
    protected swPush?: SwPush,
    protected notificationService?: NotificationService,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  public toString(correctValue: number): string {
    return String(correctValue);
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    console.log('destroying abstractquizmanagerdetails');
    this._destroy.next();
    this._destroy.complete();

    this.footerBarService.footerElemSaveQuiz.restoreClickCallback();
    this.footerBarService.footerElemBack.restoreClickCallback();

    this.hotkeysService.reset();
    this.hotkeysService.hotkeys = [];
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const queryParams = this.route.queryParamMap.pipe(tap(params => this.queryParams.id = params.get('id')));
    const questionIndex$ = queryParams.pipe( //
      switchMapTo(this.route.paramMap), //
      map(params => parseInt(params.get('questionIndex'), 10)), //
      switchMap(this.loadPoolQuizData.bind(this)), //
      takeUntil(this._destroy), //
    );

    questionIndex$.pipe(switchMapTo(this.quizService.quizUpdateEmitter), takeUntil(this._destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this._question = this.quizService.quiz.questionList[this._questionIndex];
      if (!this._question) {
        return;
      }

      this.footerBarService.footerElemSaveQuiz.isActive = this._question.isValid() && this._question.tags.length > 0;

      this.initialized$.next(true);
    });
  }

  protected loadPoolQuizData(questionIndex): Observable<any> {
    if (!isNaN(questionIndex)) {
      this._isQuizPool = false;
      this.footerBarService.footerElemBack.onClickCallback = () => this.router.navigate(['/quiz', 'manager']);
      this.showSaveQuizButton = false;
      this._questionIndex = questionIndex;
      return of(this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName)));
    } else {
      this._questionIndex = 0;
      this._isQuizPool = true;
      const footerElems = [this.footerBarService.footerElemBack];
      if (this.showSaveQuizButton) {
        footerElems.push(this.footerBarService.footerElemSaveQuiz);
        this.footerBarService.footerElemBack.onClickCallback = () => this.router.navigate(['/quiz', 'pool']);

        this.footerBarService.footerElemSaveQuiz.onClickCallback = this.saveQuiz.bind(this);
      }

      if (this.queryParams.id) {
        this.quizService.editPoolQuestion();
        this.footerBarService.replaceFooterElements(footerElems);

        if (!this.quizService.quiz) {
          return this.quizPoolApiService.getQuizpoolQuestion(this.queryParams.id).pipe(tap(data => {
            this.quizService.generatePoolQuiz([data.payload.question]);
          }));
        } else {
          return of(true);
        }

      } else {

        this.quizService.isAddingPoolQuestion = true;
        this.footerBarService.replaceFooterElements(footerElems);
        return of(true);
      }
    }
  }

  private async saveQuiz(state: FooterbarElement): Promise<void> {
    if (!state.isActive) {
      return;
    }

    if (this.queryParams.id) {
      this.quizPoolApiService.putApproveQuestion(this.queryParams.id, false, this.quizService.currentQuestion()).subscribe(() => {
        this.router.navigate(['/admin', 'quiz', 'pool']);
      });
    } else {

      let sub: PushSubscriptionJSON;

      try {
        sub = (await this.storageService.db.Config.get(StorageKey.PushSubscription))?.value;

        if (!sub) {

          const confirmed = confirm(this.translate.instant('notification.request-permission'));

          if (confirmed) {
            sub = (await this.swPush.requestSubscription({
              serverPublicKey: this.notificationService.vapidPublicKey,
            })).toJSON();
            await this.storageService.db.Config.put({ type: StorageKey.PushSubscription, value: sub });
          }
        }
      } catch (e) {
        console.error('Error while trying to load a swpush subscription', e);
      }

      this.quizPoolApiService.postNewQuestion(this.quizService.currentQuestion(), null, sub).subscribe(() => {
        this.router.navigate(['/quiz', 'pool']);
      });
    }
  }
}
