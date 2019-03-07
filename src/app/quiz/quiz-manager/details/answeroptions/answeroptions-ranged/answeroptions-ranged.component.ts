import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RangedQuestionEntity } from '../../../../../../lib/entities/question/RangedQuestionEntity';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answeroptions-ranged',
  templateUrl: './answeroptions-ranged.component.html',
  styleUrls: ['./answeroptions-ranged.component.scss'],
})
export class AnsweroptionsRangedComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsRangedComponent';

  private _question: RangedQuestionEntity;

  get question(): RangedQuestionEntity {
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

  constructor(private headerLabelService: HeaderLabelService, private quizService: QuizService, private route: ActivatedRoute) {
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
    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = <RangedQuestionEntity>this.quizService.quiz.questionList[this._questionIndex];
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
    this.quizService.quiz.questionList[this._questionIndex] = <RangedQuestionEntity>this._question;
    this.quizService.persist();
  }

}
