import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FreeTextAnswerEntity } from '../../../../../lib/entities/answer/FreetextAnwerEntity';
import { FreeTextQuestionEntity } from '../../../../../lib/entities/question/FreeTextQuestionEntity';
import { StorageKey } from '../../../../../lib/enums/enums';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answeroptions-freetext',
  templateUrl: './answeroptions-freetext.component.html',
  styleUrls: ['./answeroptions-freetext.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnsweroptionsFreetextComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsFreetextComponent';

  private _question: FreeTextQuestionEntity;

  get question(): FreeTextQuestionEntity {
    return this._question;
  }

  private _matchText = '';

  get matchText(): string {
    return this._matchText;
  }

  private _testInput = '';

  get testInput(): string {
    return this._testInput;
  }

  private readonly _destroy = new Subject();
  private _questionIndex: number;

  constructor(private headerLabelService: HeaderLabelService, private quizService: QuizService, private route: ActivatedRoute) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }


  public setTestInput(event: Event): void {
    this._testInput = (<HTMLTextAreaElement>event.target).value;
  }

  public setMatchText(event: Event): void {
    this.getTypesafeAnswer().answerText = (
      <HTMLTextAreaElement>event.target
    ).value;
  }

  public hasTestInput(): boolean {
    return this._testInput.length > 0;
  }

  public isTestInputCorrect(): boolean {
    return this.getTypesafeAnswer().isCorrectInput(this._testInput);
  }

  public setConfig(configIdentifier: string, configValue: boolean): void {
    this.getTypesafeAnswer().setConfig(configIdentifier, configValue);
  }

  public ngOnInit(): void {
    this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged(), takeUntil(this._destroy))
    .subscribe(questionIndex => {
      this._questionIndex = questionIndex;

      if (this.quizService.quiz) {
        this._question = this.quizService.quiz.questionList[this._questionIndex] as FreeTextQuestionEntity;

        if (!this._question.answerOptionList.length) {
          this._question.answerOptionList.push(new FreeTextAnswerEntity({
            answerText: '',
            configCaseSensitive: false,
            configTrimWhitespaces: false,
            configUseKeywords: false,
            configUsePunctuation: false,
          }));
        }
      }

      this._matchText = this.getTypesafeAnswer().answerText;
    });

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    this.quizService.quiz.questionList[this._questionIndex] = this.question;
    this.quizService.persist();

    this._destroy.next();
    this._destroy.complete();
  }

  public getTypesafeAnswer(): FreeTextAnswerEntity {
    return this.question.answerOptionList[0] as FreeTextAnswerEntity;
  }
}
