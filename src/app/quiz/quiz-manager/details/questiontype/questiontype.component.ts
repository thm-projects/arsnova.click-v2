import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../../lib/available-question-types';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../../lib/enums/enums';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { getQuestionForType } from '../../../../../lib/QuizValidator';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss'],
})
export class QuestiontypeComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuestiontypeComponent';

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  private _question: AbstractQuestionEntity;
  private _questionIndex: number;
  private _questionType: string;

  private readonly _destroy = new Subject();

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestiontypeComponent.TYPE;

    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnInit(): void {
    const questionIndex$ = this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged());

    this.quizService.quizUpdateEmitter.pipe(switchMapTo(questionIndex$), takeUntil(this._destroy)).subscribe(questionIndex => {
      if (!this.quizService.quiz || isNaN(questionIndex)) {
        return;
      }

      this._questionIndex = questionIndex;
      this._question = this.quizService.quiz.questionList[this._questionIndex];
      this._questionType = this._question.TYPE;
      this._selectableQuestionTypes = this._selectableQuestionTypes.sort((a) => a.id === this._questionType ? -1 : 0);
    });
  }

  public isActiveQuestionType(type: string): boolean {
    return type === this._questionType;
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public morphToQuestionType(type: QuestionType): void {
    this._question = getQuestionForType(type, this._question);
    this._questionType = type;

    this.quizService.quiz.removeQuestion(this._questionIndex);
    this.quizService.quiz.addQuestion(this._question, this._questionIndex);
    this.quizService.persist();
  }
}
