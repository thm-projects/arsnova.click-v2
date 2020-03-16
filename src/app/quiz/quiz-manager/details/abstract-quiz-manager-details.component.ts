import { isPlatformServer } from '@angular/common';
import { HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { QuizPoolApiService } from '../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

export abstract class AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  public showSaveQuizButton = false;
  protected initialized$ = new ReplaySubject(1);

  get queryParams(): Params {
    return this._queryParams;
  }

  protected _question: AbstractQuestionEntity;

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  protected _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  get destroy(): Subject<any> {
    return this._destroy;
  }

  private _queryParams: Params = {};
  private readonly _destroy = new Subject();

  protected constructor(
    protected platformId: Object,
    public quizService: QuizService,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    protected quizPoolApiService: QuizPoolApiService,
    private router: Router,
    protected route: ActivatedRoute,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  public toString(correctValue: number): string {
    return String(correctValue);
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();

    this.footerBarService.footerElemSaveQuiz.restoreClickCallback();
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const queryParams = this.route.queryParamMap.pipe(tap(params => this.queryParams.id = params.get('id')));
    const questionIndex$ = queryParams.pipe( //
      switchMapTo(this.route.paramMap), //
      map(params => parseInt(params.get('questionIndex'), 10)), //
      distinctUntilChanged(), //
      switchMap(this.loadPoolQuizData.bind(this)), //
      takeUntil(this._destroy), //
    );

    questionIndex$.pipe(switchMapTo(this.quizService.quizUpdateEmitter), takeUntil(this._destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this._question = this.quizService.quiz.questionList[this._questionIndex];
      this.footerBarService.footerElemSaveQuiz.isActive = this._question.isValid() && this._question.tags.length > 0;

      this.initialized$.next(true);
    });
  }

  protected loadPoolQuizData(questionIndex): Observable<any> {
    if (!isNaN(questionIndex)) {
      this.showSaveQuizButton = false;
      this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
      this._questionIndex = questionIndex;
      return of(true);
    } else {
      this._questionIndex = 0;
      const footerElems = [this.footerBarService.footerElemBack];
      if (this.showSaveQuizButton) {
        footerElems.push(this.footerBarService.footerElemSaveQuiz);

        this.footerBarService.footerElemSaveQuiz.onClickCallback = self => {
          if (!self.isActive) {
            return;
          }

          if (this.queryParams.id) {
            this.quizPoolApiService.putApproveQuestion(this.queryParams.id, this.quizService.currentQuestion(), false).subscribe(() => {
              this.router.navigate(['/admin', 'quiz', 'pool']);
            });
          } else {
            this.quizPoolApiService.postNewQuestion(this.quizService.currentQuestion()).subscribe(() => {
              this.router.navigate(['/quiz', 'pool']);
            });
          }
        };
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
}
