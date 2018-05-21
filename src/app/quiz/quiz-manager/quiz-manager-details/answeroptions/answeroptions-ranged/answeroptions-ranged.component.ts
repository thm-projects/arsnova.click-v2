import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestionRanged } from 'arsnova-click-v2-types/src/questions/interfaces';
import { Subscription } from 'rxjs';
import { ActiveQuestionGroupService } from '../../../../../service/active-question-group/active-question-group.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';

@Component({
  selector: 'app-answeroptions-ranged',
  templateUrl: './answeroptions-ranged.component.html',
  styleUrls: ['./answeroptions-ranged.component.scss'],
})
export class AnsweroptionsRangedComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsRangedComponent';

  private _question: IQuestionRanged;

  get question(): IQuestionRanged {
    return this._question;
  }

  private _minRange: number;

  get minRange(): number {
    return this._minRange;
  }

  private _maxRange: number;

  get maxRange(): number {
    return this._maxRange;
  }

  private _correctValue: number;

  get correctValue(): number {
    return this._correctValue;
  }

  private _questionIndex: number;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  public updateMinRange(event: Event): void {
    this._minRange = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public updateMaxRange(event: Event): void {
    this._maxRange = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public updateCorrectValue(event: Event): void {
    this._correctValue = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <IQuestionRanged>this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._minRange = this._question.rangeMin;
      this._maxRange = this._question.rangeMax;
      this._correctValue = this._question.correctValue;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy(): void {
    this._question.rangeMin = this._minRange;
    this._question.rangeMax = this._maxRange;
    this._question.correctValue = this._correctValue;
    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex] = this._question;
    this.activeQuestionGroupService.persist();
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}
