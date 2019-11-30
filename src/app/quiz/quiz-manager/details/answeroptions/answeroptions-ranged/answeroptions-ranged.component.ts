import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { RangedQuestionEntity } from '../../../../../lib/entities/question/RangedQuestionEntity';
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

  private _minRange: string;

  get minRange(): string {
    return this._minRange;
  }

  set minRange(value: string) {
    this._minRange = value;
  }

  private _maxRange: string;

  get maxRange(): string {
    return this._maxRange;
  }

  set maxRange(value: string) {
    this._maxRange = value;
  }

  private _correctValue: string;

  get correctValue(): string {
    return this._correctValue;
  }

  set correctValue(value: string) {
    this._correctValue = value;
  }

  private readonly _destroy = new Subject();
  private _questionIndex: number;

  constructor(private headerLabelService: HeaderLabelService, private quizService: QuizService, private route: ActivatedRoute) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }

  public ngOnInit(): void {
    this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged(), takeUntil(this._destroy))
    .subscribe(questionIndex => {

      this._questionIndex = questionIndex;
      this._question = this.quizService.quiz.questionList[this._questionIndex] as RangedQuestionEntity;
      this._minRange = String(this._question.rangeMin);
      this._maxRange = String(this._question.rangeMax);
      this._correctValue = String(this._question.correctValue);
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    this._question.rangeMin = parseInt(this._minRange, 10);
    this._question.rangeMax = parseInt(this._maxRange, 10);
    this._question.correctValue = parseInt(this._correctValue, 10);

    this.quizService.quiz.questionList[this._questionIndex] = this._question;
    this.quizService.persist();

    this._destroy.next();
    this._destroy.complete();
  }

}
