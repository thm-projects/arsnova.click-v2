import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  public static TYPE = 'CountdownComponent';
  public minCountdownValue = '0';

  private _parsedHours = '0';

  get parsedHours(): string {
    return this._parsedHours;
  }

  private _parsedMinutes = '0';

  get parsedMinutes(): string {
    return this._parsedMinutes;
  }

  private _parsedSeconds = '0';

  get parsedSeconds(): string {
    return this._parsedSeconds;
  }

  private _plainHours = 0;

  get plainHours(): number {
    return this._plainHours;
  }

  private _plainMinutes = 0;

  get plainMinutes(): number {
    return this._plainMinutes;
  }

  private _plainSeconds = 0;

  get plainSeconds(): number {
    return this._plainSeconds;
  }

  private _countdown: string = this.minCountdownValue;

  get countdown(): string {
    return this._countdown;
  }

  set countdown(value: string) {
    this._countdown = value;
  }

  private _questionIndex: number;
  private _question: AbstractQuestionEntity;

  private readonly _destroy = new Subject();

  constructor(
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = CountdownComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  public updateCountdown(countdown: number): void {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown - hours * 3600) / 60);
    const seconds = Math.floor((countdown - hours * 3600) - (minutes * 60));
    this._countdown = String(countdown);

    this._parsedHours = String(hours);
    this._parsedMinutes = String(minutes);
    this._parsedSeconds = String(seconds);

    this._plainHours = parseInt(this._parsedHours, 10);
    this._plainMinutes = parseInt(this._parsedMinutes, 10);
    this._plainSeconds = parseInt(this._parsedSeconds, 10);

    this.quizService.quiz.questionList[this._questionIndex].timer = parseInt(this.countdown, 10) || 0;
  }

  public ngOnInit(): void {
    const questionIndex$ = this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged());

    this.quizService.quizUpdateEmitter.pipe(switchMapTo(questionIndex$), takeUntil(this._destroy)).subscribe(questionIndex => {
      if (!this.quizService.quiz || isNaN(questionIndex)) {
        return;
      }

      this._questionIndex = questionIndex;
      this._question = this.quizService.quiz.questionList[this._questionIndex];
      this.updateCountdown(this._question.timer);
    });

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    this.quizService.persist();
    this._destroy.next();
    this._destroy.complete();
  }

}

