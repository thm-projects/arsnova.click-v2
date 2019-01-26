import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

  private dataSource: string | Array<string>;
  private _questionIndex: number;
  private _subscription: Subscription;
  private _routerSubscription: Subscription;

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
      case 0:
        return 'device_xs';
      case 1:
        return 'device_sm';
      case 2:
        return 'device_md';
      case 3:
        return 'device_lg';
      case 4:
        return 'device_xlg';
    }
  }

  public getComputedWidth(): string {
    switch (this.targetDevice) {
      case 0:
        return 'calc(50% - 1rem)';
      case 1:
        return 'device_sm';
      case 2:
        return 'device_md';
      case 3:
        return 'device_lg';
      case 4:
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
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this._subscription = this.questionTextService.eventEmitter.subscribe(value => {
      this.dataSource = value;
    });
    switch (this.targetEnvironment) {
      case this.ENVIRONMENT_TYPE.ANSWEROPTIONS:
        this._routerSubscription = this.route.params.subscribe(params => {
          this._questionIndex = +params['questionIndex'];
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
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}
