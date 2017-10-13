import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionTextService} from '../../service/question-text.service';
import {Subscription} from 'rxjs/Subscription';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../environments/environment';
import {IAnswerOption} from '../../../lib/answeroptions/interfaces';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {IQuestionChoice} from '../../../lib/questions/interfaces';

@Component({
             selector: 'app-live-preview',
             templateUrl: './live-preview.component.html',
             styleUrls: ['./live-preview.component.scss']
           })
export class LivePreviewComponent implements OnInit, OnDestroy {
  get question(): IQuestionChoice {
    return this._question;
  }

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  @Input() private targetDevice: DEVICE_TYPES;
  @Input() private targetEnvironment: LIVE_PREVIEW_ENVIRONMENT;
  private questionTextDataSource: string;
  private answers: Array<IAnswerOption>;

  private _question: IQuestionChoice;
  private _questionIndex: number;
  private _subscription: Subscription;

  constructor(
    private questionTextService: QuestionTextService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute) {
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

  ngOnInit() {
    switch (this.targetEnvironment) {
      case this.ENVIRONMENT_TYPE.QUESTION:
        this.questionTextDataSource = this.questionTextService.currentValue.join('<br/>');
        this._subscription = this.questionTextService.getEmitter().subscribe(
          value => this.questionTextDataSource = value.join('<br/>')
        );
        break;
      case this.ENVIRONMENT_TYPE.ANSWEROPTIONS:
        this._subscription = this.route.params.subscribe(params => {
          this._questionIndex = +params['questionIndex'];
          this._question = <IQuestionChoice>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
          this.answers = this._question.answerOptionList;
        });
        break;
      default:
        throw new Error('Unsupported environment type in live preview');
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

}
