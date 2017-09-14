import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {QuestionI} from "../../../../../lib/questions/QuestionI";
import {Subscription} from "rxjs/Subscription";
import {ActiveQuestionGroupService} from "../../../../service/active-question-group.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {DefaultAnswerOption} from "../../../../../lib/answeroptions/answeroption_default";
import {QuestionSurveyI} from "../../../../../lib/questions/QuestionSurveyI";
import {QuestionChoiceI} from "../../../../../lib/questions/QuestionChoiceI";

@Component({
  selector: 'app-answeroptions-default',
  templateUrl: './answeroptions-default.component.html',
  styleUrls: ['./answeroptions-default.component.scss']
})
export class AnsweroptionsDefaultComponent implements OnInit, OnDestroy {
  get question(): QuestionChoiceI {
    return this._question;
  }

  private _questionIndex: number;
  private _question: QuestionChoiceI;
  private _routerSubscription: Subscription;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private translateService: TranslateService,
              private route: ActivatedRoute) {
  }

  addAnswer(): void {
    this._question.addDefaultAnswerOption();
  }

  updateAnswerValue(event: Event, index: number): void {
    this._question.answerOptionList[index].answerText = (<HTMLInputElement>event.target).value;
  }

  toggleMultipleSelectionSurvey(): void {
    (<QuestionSurveyI>this._question).multipleSelectionEnabled = !(<QuestionSurveyI>this._question).multipleSelectionEnabled;
  }

  toggleShowOneAnswerPerRow(): void {
    this._question.showOneAnswerPerRow = !this._question.showOneAnswerPerRow;
  }

  toggleShowAnswerContentOnButtons(): void {
    this._question.displayAnswerText = !this._question.displayAnswerText;
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <QuestionChoiceI>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
    });
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
    this._routerSubscription.unsubscribe();
  }
}

