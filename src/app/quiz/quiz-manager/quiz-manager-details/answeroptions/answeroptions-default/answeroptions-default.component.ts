import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActiveQuestionGroupService} from '../../../../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {IQuestionChoice, IQuestionSurvey} from 'arsnova-click-v2-types/src/questions/interfaces';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../../../../environments/environment';
import {QuestionTextService} from '../../../../../service/question-text.service';
import {HeaderLabelService} from '../../../../../service/header-label.service';

@Component({
  selector: 'app-answeroptions-default',
  templateUrl: './answeroptions-default.component.html',
  styleUrls: ['./answeroptions-default.component.scss']
})
export class AnsweroptionsDefaultComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsDefaultComponent';

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  get question(): IQuestionChoice {
    return this._question;
  }

  private _questionIndex: number;
  private _question: IQuestionChoice;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private questionTextService: QuestionTextService,
    private route: ActivatedRoute
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  addAnswer(): void {
    this._question.addDefaultAnswerOption();
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  deleteAnswer(index: number): void {
    this._question.answerOptionList.splice(index, 1);
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  updateAnswerValue(event: Event, index: number): void {
    this._question.answerOptionList[index].answerText = (<HTMLInputElement>event.target).value;
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  toggleMultipleSelectionSurvey(): void {
    (<IQuestionSurvey>this._question).multipleSelectionEnabled = !(<IQuestionSurvey>this._question).multipleSelectionEnabled;
  }

  toggleShowOneAnswerPerRow(): void {
    this._question.showOneAnswerPerRow = !this._question.showOneAnswerPerRow;
  }

  toggleShowAnswerContentOnButtons(): void {
    this._question.displayAnswerText = !this._question.displayAnswerText;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <IQuestionChoice>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
  }
}
