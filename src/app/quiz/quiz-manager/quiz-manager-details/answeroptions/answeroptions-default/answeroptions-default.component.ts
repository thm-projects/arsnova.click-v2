import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestionChoice, IQuestionSurvey } from 'arsnova-click-v2-types/src/questions/interfaces';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../../../../environments/environment';
import { ActiveQuestionGroupService } from '../../../../../service/active-question-group/active-question-group.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';

@Component({
  selector: 'app-answeroptions-default',
  templateUrl: './answeroptions-default.component.html',
  styleUrls: ['./answeroptions-default.component.scss'],
})
export class AnsweroptionsDefaultComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsDefaultComponent';
  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private _question: IQuestionChoice;

  get question(): IQuestionChoice {
    return this._question;
  }

  private _questionIndex: number;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private questionTextService: QuestionTextService,
    private route: ActivatedRoute,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  public addAnswer(): void {
    this._question.addDefaultAnswerOption();
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public deleteAnswer(index: number): void {
    this._question.answerOptionList.splice(index, 1);
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public updateAnswerValue(event: Event, index: number): void {
    this._question.answerOptionList[index].answerText = (<HTMLInputElement>event.target).value;
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public toggleMultipleSelectionSurvey(): void {
    (<IQuestionSurvey>this._question).multipleSelectionEnabled = !(<IQuestionSurvey>this._question).multipleSelectionEnabled;
  }

  public toggleShowOneAnswerPerRow(): void {
    this._question.showOneAnswerPerRow = !this._question.showOneAnswerPerRow;
  }

  public toggleShowAnswerContentOnButtons(): void {
    this._question.displayAnswerText = !this._question.displayAnswerText;
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <IQuestionChoice>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy(): void {
    this.activeQuestionGroupService.persist();
  }
}

