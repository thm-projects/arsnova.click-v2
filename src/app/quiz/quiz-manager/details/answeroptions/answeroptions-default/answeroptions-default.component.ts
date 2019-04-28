import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../../../../environments/environment';
import { AbstractChoiceQuestionEntity } from '../../../../../../lib/entities/question/AbstractChoiceQuestionEntity';
import { SurveyQuestionEntity } from '../../../../../../lib/entities/question/SurveyQuestionEntity';
import { QuestionType } from '../../../../../../lib/enums/QuestionType';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answeroptions-default',
  templateUrl: './answeroptions-default.component.html',
  styleUrls: ['./answeroptions-default.component.scss'],
})
export class AnsweroptionsDefaultComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsDefaultComponent';
  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;
  public canAddAnsweroptions = false;
  public canDeleteAnswer: boolean;
  public canEditAnswer: boolean;
  public canShowAnswerContentOnButtons: boolean;
  public canInjectEmojis: boolean;

  private _question: AbstractChoiceQuestionEntity;

  get question(): AbstractChoiceQuestionEntity {
    return this._question;
  }

  private _questionIndex: number;

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
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
    this._question.removeAnswerOption(index);
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public updateAnswerValue(event: Event, index: number): void {
    this._question.answerOptionList[index].answerText = (<HTMLInputElement>event.target).value;
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public toggleMultipleSelectionSurvey(): void {
    (<SurveyQuestionEntity>this._question).multipleSelectionEnabled = !(<SurveyQuestionEntity>this._question).multipleSelectionEnabled;
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
      this._question = <AbstractChoiceQuestionEntity>this.quizService.quiz.questionList[this._questionIndex];

      this.canAddAnsweroptions = ![QuestionType.TrueFalseSingleChoiceQuestion, QuestionType.YesNoSingleChoiceQuestion].includes(this._question.TYPE);
      this.canDeleteAnswer = true;
      this.canEditAnswer = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);
      this.canShowAnswerContentOnButtons = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);
      this.canInjectEmojis = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);

      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy(): void {
    this.quizService.persist();
  }
}

