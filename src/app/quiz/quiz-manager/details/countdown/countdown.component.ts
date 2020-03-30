import { isPlatformServer } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent extends AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
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
    this.updateCountdown(parseInt(value, 10));
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

    footerBarService.TYPE_REFERENCE = CountdownComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
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

    this.quizService.quiz.questionList[this._questionIndex].timer = countdown || 0;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.quizService.quizUpdateEmitter.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this.updateCountdown(this._question.timer);
    });
  }

  @HostListener('window:beforeunload', [])
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.quizService.persist();
  }
}

