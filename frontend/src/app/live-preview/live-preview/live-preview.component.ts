import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionTextService} from '../../service/question-text.service';
import {Subscription} from 'rxjs/Subscription';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../environments/environment';
import {IAnswerOption} from '../../../lib/answeroptions/interfaces';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {IQuestionChoice} from '../../../lib/questions/interfaces';
import {DomSanitizer, SafeHtml, SafeStyle} from '@angular/platform-browser';
import {DefaultSettings} from '../../service/settings.service';
import {HttpClient} from '@angular/common/http';
import {IMathjaxResponse} from '../../../lib/common.interfaces';
import {parseGithubFlavoredMarkdown} from '../../../lib/markdown/markdown';

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss']
})
export class LivePreviewComponent implements OnInit, OnDestroy {
  get targetDevice(): DEVICE_TYPES {
    return this._targetDevice;
  }

  get targetEnvironment(): LIVE_PREVIEW_ENVIRONMENT {
    return this._targetEnvironment;
  }

  get question(): IQuestionChoice {
    return this._question;
  }

  @Input()
  set targetDevice(value: DEVICE_TYPES) {
    this._targetDevice = value;
  }

  @Input()
  set targetEnvironment(value: LIVE_PREVIEW_ENVIRONMENT) {
    this._targetEnvironment = value;
  }

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private _targetDevice: DEVICE_TYPES;
  private _targetEnvironment: LIVE_PREVIEW_ENVIRONMENT;
  private dataSource: string | Array<string>;

  private _question: IQuestionChoice;
  private _questionIndex: number;
  private _subscription: Subscription;
  private _routerSubscription: Subscription;

  constructor(
    public questionTextService: QuestionTextService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
  }

  public deviceClass() {
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

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  ngOnInit() {
    this._subscription = this.questionTextService.getEmitter().subscribe(
      value => {
        this.dataSource = value;
      }
    );
    switch (this.targetEnvironment) {
      case this.ENVIRONMENT_TYPE.ANSWEROPTIONS:
        this._routerSubscription = this.route.params.subscribe(params => {
          this._questionIndex = +params['questionIndex'];
          this._question = <IQuestionChoice>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
          this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
        });
        break;
      case this.ENVIRONMENT_TYPE.QUESTION:
        break;
      default:
        throw new Error('Unsupported environment type in live preview');
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}
