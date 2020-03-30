import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMapTo, takeUntil } from 'rxjs/operators';
import { FreeTextAnswerEntity } from '../../../../../lib/entities/answer/FreetextAnwerEntity';
import { FreeTextQuestionEntity } from '../../../../../lib/entities/question/FreeTextQuestionEntity';
import { QuizPoolApiService } from '../../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-answeroptions-freetext',
  templateUrl: './answeroptions-freetext.component.html',
  styleUrls: ['./answeroptions-freetext.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnsweroptionsFreetextComponent extends AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsFreetextComponent';

  protected _question: FreeTextQuestionEntity;

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

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    quizService: QuizService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route);
  }


  public setTestInput(event: Event): void {
    this._testInput = (
      <HTMLTextAreaElement>event.target
    ).value;
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
    super.ngOnInit();

    this.quizService.quizUpdateEmitter.pipe(switchMapTo(this.initialized$), takeUntil(this.destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this._matchText = this.getTypesafeAnswer().answerText;
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.quizService.quiz.questionList[this._questionIndex] = this.question;
    this.quizService.persist();
  }

  public getTypesafeAnswer(): FreeTextAnswerEntity {
    return this.question?.answerOptionList[0] as FreeTextAnswerEntity;
  }
}
