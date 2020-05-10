import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbstractChoiceQuestionEntity } from '../../../../lib/entities/question/AbstractChoiceQuestionEntity';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCardComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'QuestionCardComponent';

  private readonly _destroy = new Subject();
  private _revalidateSubscription: Subscription;
  private _elem: AbstractQuestionEntity;
  private _canMoveUp: boolean;
  private _canMoveDown: boolean;
  private _isUploading: boolean;
  private _isBodyHidden: boolean;

  @Input() public index: number;
  @Output() public readonly bodyVisibility = new EventEmitter<void>();
  @Output() public readonly moveUp = new EventEmitter<void>();
  @Output() public readonly moveDown = new EventEmitter<void>();
  @Output() public readonly edit = new EventEmitter<void>();
  @Output() public readonly delete = new EventEmitter<void>();

  public renderedQuestionText: SafeHtml;

  public get elem(): AbstractQuestionEntity {
    return this._elem;
  }

  @Input()
  public set elem(questionEntity: AbstractQuestionEntity) {
    this._elem = questionEntity;

    this.questionTextService.change(questionEntity.questionText).subscribe(value => {
      this.renderedQuestionText = this.sanitizer.bypassSecurityTrustHtml(value);
      this.cdRef.detectChanges();
    });
  }

  get canMoveUp(): boolean {
    return this._canMoveUp;
  }

  @Input() set canMoveUp(value: boolean) {
    this._canMoveUp = value;
    this.cdRef.detectChanges();
  }

  get canMoveDown(): boolean {
    return this._canMoveDown;
  }

  @Input() set canMoveDown(value: boolean) {
    this._canMoveDown = value;
    this.cdRef.detectChanges();
  }

  @Input()
  public set revalidate(subject: Subject<void>) {
    if (this._revalidateSubscription) {
      this._revalidateSubscription.unsubscribe();
    }
    this._revalidateSubscription = subject.pipe(takeUntil(this._destroy)).subscribe(() => {
      this.cdRef.detectChanges();
    });
  }

  public get isUploading(): boolean {
    return this._isUploading;
  }

  public get isBodyHidden(): boolean {
    return this._isBodyHidden;
  }

  @Input()
  public set isBodyHidden(value: boolean) {
    this._isBodyHidden = value;
    this.cdRef.detectChanges();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public quizService: QuizService,
    private router: Router,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private quizPoolApiService: QuizPoolApiService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
  ) {
    this.cdRef.detach();
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public updloadToQuizPool(): void {
    if (!this.elem?.isValid() || !this.elem?.tags?.length || this.isUploading) {
      return;
    }

    const removeQuestionFromUploadingQueue = () => {
      this._isUploading = false;
      this.cdRef.detectChanges();
    };

    this._isUploading = true;
    this.cdRef.detectChanges();
    this.quizPoolApiService.postNewQuestion(this.elem, `${this.quizService.quiz.name}`).subscribe({
      complete: removeQuestionFromUploadingQueue,
      error: removeQuestionFromUploadingQueue,
    });
  }

  public getTooltipForUpload(): string {
    return !this.elem?.isValid() ? //
           'component.quiz_summary.upload-to-pool.invalid-question' : //
           !this.elem?.tags?.length ? //
           'component.quiz_summary.upload-to-pool.no-tags' : //
           'component.quiz_summary.upload-to-pool.valid-upload';
  }

  public isChoiceQuestion(): boolean {
    return this.elem instanceof AbstractChoiceQuestionEntity;
  }
}
