import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../environments/environment';
import { AbstractChoiceQuestionEntity } from '../../lib/entities/question/AbstractChoiceQuestionEntity';
import { StorageKey } from '../../lib/enums/enums';
import { ConnectionService } from '../../service/connection/connection.service';
import { QuestionTextService } from '../../service/question-text/question-text.service';
import { QuizService } from '../../service/quiz/quiz.service';

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivePreviewComponent implements OnInit, OnDestroy {
  public static TYPE = 'LivePreviewComponent';

  private _targetEnvironment: LIVE_PREVIEW_ENVIRONMENT;
  private _revalidate: Subscription;
  private _targetDevice: DEVICE_TYPES;
  private _question: AbstractChoiceQuestionEntity;
  private readonly _destroy = new Subject();
  private _questionIndex: number;

  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;
  public dataSource: Array<string>;

  @Input() set revalidate(value: Subject<any>) {
    if (this._revalidate) {
      this._revalidate.unsubscribe();
    }
    if (value) {
      this._revalidate = value.pipe(takeUntil(this._destroy)).subscribe(() => this.cd.markForCheck());
    }
  }

  get targetEnvironment(): LIVE_PREVIEW_ENVIRONMENT {
    return this._targetEnvironment;
  }

  @Input() set targetEnvironment(value: LIVE_PREVIEW_ENVIRONMENT) {
    this._targetEnvironment = value;
  }

  get targetDevice(): DEVICE_TYPES {
    return this._targetDevice;
  }

  @Input() set targetDevice(value: DEVICE_TYPES) {
    this._targetDevice = value;
  }

  get question(): AbstractChoiceQuestionEntity {
    return this._question;
  }

  constructor(
    public questionTextService: QuestionTextService,
    public connectionService: ConnectionService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {
  }

  public deviceClass(): string {
    switch (this.targetDevice) {
      case DEVICE_TYPES.XS:
        return 'device_xs';
      case DEVICE_TYPES.SM:
        return 'device_sm';
      case DEVICE_TYPES.MD:
        return 'device_md';
      case DEVICE_TYPES.LG:
        return 'device_lg';
      case DEVICE_TYPES.XLG:
        return 'device_xlg';
    }
  }

  public getComputedWidth(): string {
    switch (this.targetDevice) {
      case DEVICE_TYPES.XS:
        return 'calc(50% - 1rem)';
      case DEVICE_TYPES.SM:
        return 'device_sm';
      case DEVICE_TYPES.MD:
        return 'device_md';
      case DEVICE_TYPES.LG:
        return 'device_lg';
      case DEVICE_TYPES.XLG:
        return 'device_xlg';
    }
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public sanitizeHTML(value: string): string;
  public sanitizeHTML(value: Array<string>): string;
  public sanitizeHTML(value: string | Array<string>): string {
    if (Array.isArray(value)) {
      value = value.join('');
    }

    // sanitizer.bypassSecurityTrustHtml is required for highslide
    return this.sanitizer.bypassSecurityTrustHtml(value || '') as string;
  }

  public ngOnInit(): void {
    this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe(value => {
      this.dataSource = Array.isArray(value) ? value : [value];
      this.cd.markForCheck();
    });

    this.route.paramMap.pipe( //
      filter(() => isPlatformBrowser(this.platformId)), //
      map(params => parseInt(params.get('questionIndex'), 10)), //
      distinctUntilChanged(), //
      switchMap(questionIndex => {
        if (!isNaN(questionIndex)) {
          this._questionIndex = questionIndex;

          return new Observable(subscriber => {
            this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
              subscriber.next();
              subscriber.complete();
            });
          }).pipe(switchMap(() => {
            this._question = <AbstractChoiceQuestionEntity>this.quizService.quiz.questionList[this._questionIndex];

            switch (this.targetEnvironment) {
              case this.ENVIRONMENT_TYPE.ANSWEROPTIONS:
                const answers = this._question.answerOptionList.map(answer => answer.answerText);
                return this.questionTextService.changeMultiple(answers);
              case this.ENVIRONMENT_TYPE.QUESTION:
                return this.questionTextService.change(this._question?.questionText);
              default:
                throw new Error(`Unsupported environment type in live preview: '${this.targetEnvironment}'`);
            }
          }));
        } else {
          this.quizService.isAddingPoolQuestion = true;
          this._questionIndex = 0;
          return of();
        }
      }), //
      takeUntil(this._destroy), //
    ).subscribe(() => this.cd.markForCheck());
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();

    if (isPlatformBrowser(this.platformId) && window['hs']) {
      window['hs'].close();
    }
  }
}
