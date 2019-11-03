import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../environments/environment';
import { AbstractChoiceQuestionEntity } from '../../../lib/entities/question/AbstractChoiceQuestionEntity';
import { ConnectionService } from '../../service/connection/connection.service';
import { QuestionTextService } from '../../service/question-text/question-text.service';
import { QuizService } from '../../service/quiz/quiz.service';

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss'],
})
export class LivePreviewComponent implements OnInit, OnDestroy {
  public static TYPE = 'LivePreviewComponent';
  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private _targetEnvironment: LIVE_PREVIEW_ENVIRONMENT;

  get targetEnvironment(): LIVE_PREVIEW_ENVIRONMENT {
    return this._targetEnvironment;
  }

  @Input() set targetEnvironment(value: LIVE_PREVIEW_ENVIRONMENT) {
    this._targetEnvironment = value;
  }

  private _targetDevice: DEVICE_TYPES;

  get targetDevice(): DEVICE_TYPES {
    return this._targetDevice;
  }

  @Input() set targetDevice(value: DEVICE_TYPES) {
    this._targetDevice = value;
  }

  private _question: AbstractChoiceQuestionEntity;

  get question(): AbstractChoiceQuestionEntity {
    return this._question;
  }

  private readonly _destroy = new Subject();
  private dataSource: string | Array<string>;
  private _questionIndex: number;

  constructor(
    public questionTextService: QuestionTextService,
    public connectionService: ConnectionService,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
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

  public sanitizeHTML(value: string): SafeHtml;
  public sanitizeHTML<T>(value: Array<string>): SafeHtml;
  public sanitizeHTML(value: string | Array<string>): SafeHtml {
    if (Array.isArray(value)) {
      value = value.join('');
    }

    // sanitizer.bypassSecurityTrustHtml is required for highslide
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe(value => {
      this.dataSource = value;
    });
    const questionIndex$ = this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged(),
      takeUntil(this._destroy));

    switch (this.targetEnvironment) {
      case this.ENVIRONMENT_TYPE.ANSWEROPTIONS:
        questionIndex$.subscribe(questionIndex => {
          this._questionIndex = questionIndex;
          this._question = <AbstractChoiceQuestionEntity>this.quizService.quiz.questionList[this._questionIndex];
          this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
        });
        break;
      case this.ENVIRONMENT_TYPE.QUESTION:
        break;
      default:
        throw new Error(`Unsupported environment type in live preview: '${this.targetEnvironment}'`);
    }
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
