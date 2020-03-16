import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMapTo, takeUntil } from 'rxjs/operators';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../../../../environments/environment';
import { AbstractChoiceQuestionEntity } from '../../../../../lib/entities/question/AbstractChoiceQuestionEntity';
import { SurveyQuestionEntity } from '../../../../../lib/entities/question/SurveyQuestionEntity';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { QuizPoolApiService } from '../../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-answeroptions-default',
  templateUrl: './answeroptions-default.component.html',
  styleUrls: ['./answeroptions-default.component.scss'],
})
export class AnsweroptionsDefaultComponent extends AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsDefaultComponent';
  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;
  public canAddAnsweroptions = false;
  public canDeleteAnswer: boolean;
  public canEditAnswer: boolean;
  public canShowAnswerContentOnButtons: boolean;
  public canInjectEmojis: boolean;

  protected _question: AbstractChoiceQuestionEntity;

  get question(): AbstractChoiceQuestionEntity {
    return this._question;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    quizService: QuizService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    private questionTextService: QuestionTextService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route);
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
    this._question.answerOptionList[index].answerText = (
      <HTMLInputElement>event.target
    ).value;
    this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
  }

  public toggleMultipleSelectionSurvey(): void {
    (
      <SurveyQuestionEntity>this._question
    ).multipleSelectionEnabled = !(
      <SurveyQuestionEntity>this._question
    ).multipleSelectionEnabled;
  }

  public toggleShowOneAnswerPerRow(): void {
    this._question.showOneAnswerPerRow = !this._question.showOneAnswerPerRow;
  }

  public toggleShowAnswerContentOnButtons(): void {
    this._question.displayAnswerText = !this._question.displayAnswerText;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.initialized$.pipe(switchMapTo(this.quizService.quizUpdateEmitter), takeUntil(this.destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this.canAddAnsweroptions = ![QuestionType.TrueFalseSingleChoiceQuestion, QuestionType.YesNoSingleChoiceQuestion].includes(this._question.TYPE);
      this.canDeleteAnswer = this.canAddAnsweroptions;
      this.canEditAnswer = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);
      this.canShowAnswerContentOnButtons = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);
      this.canInjectEmojis = ![QuestionType.ABCDSingleChoiceQuestion].includes(this._question.TYPE);

      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.quizService.quiz.questionList[this._questionIndex] = this.question;
    this.quizService.persist();
  }

  public getQuestionAsSurvey(question: AbstractChoiceQuestionEntity): SurveyQuestionEntity {
    return question as SurveyQuestionEntity;
  }
}

