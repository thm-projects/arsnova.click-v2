import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionI} from "../../../../../lib/questions/QuestionI";
import {ActiveQuestionGroupService} from "../../../../service/active-question-group.service";
import {Subscription} from "rxjs/Subscription";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {RangedQuestion} from "../../../../../lib/questions/question_ranged";
import {QuestionRangedI} from "../../../../../lib/questions/QuestionRangedI";

@Component({
  selector: 'app-answeroptions-ranged',
  templateUrl: './answeroptions-ranged.component.html',
  styleUrls: ['./answeroptions-ranged.component.scss']
})
export class AnsweroptionsRangedComponent implements OnInit, OnDestroy {
  get minRange(): number {
    return this._minRange;
  }

  get maxRange(): number {
    return this._maxRange;
  }

  get correctValue(): number {
    return this._correctValue;
  }

  get question(): QuestionRangedI {
    return this._question;
  }

  private _questionIndex: number;
  private _question: QuestionRangedI;
  private _routerSubscription: Subscription;
  private _minRange: number;
  private _maxRange: number;
  private _correctValue: number;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private translateService: TranslateService,
              private route: ActivatedRoute) {
  }

  updateMinRange(event: Event): void {
    this._minRange = parseInt((<HTMLInputElement>event.target).value);
  }

  updateMaxRange(event: Event): void {
    this._maxRange = parseInt((<HTMLInputElement>event.target).value);
  }

  updateCorrectValue(event: Event): void {
    this._correctValue = parseInt((<HTMLInputElement>event.target).value);
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <QuestionRangedI>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._minRange = this._question.rangeMin;
      this._maxRange = this._question.rangeMax;
      this._correctValue = this._question.correctValue;
    });
  }

  ngOnDestroy() {
    this._question.rangeMin = this._minRange;
    this._question.rangeMax = this._maxRange;
    this._question.correctValue = this._correctValue;
    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex] = this._question;
    this.activeQuestionGroupService.persist();
    this._routerSubscription.unsubscribe();
  }

}
