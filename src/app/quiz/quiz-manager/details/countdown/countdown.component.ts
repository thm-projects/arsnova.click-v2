import { AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { takeUntil } from 'rxjs/operators';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent extends AbstractQuizManagerDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public static readonly TYPE = 'CountdownComponent';

  private _parsedHours = '0';
  private _parsedMinutes = '0';
  private _parsedSeconds = '0';
  private _plainHours = 0;
  private _plainMinutes = 0;
  private _plainSeconds = 0;

  public minCountdownValue = '0';
  public _countdown: string = this.minCountdownValue;

  get parsedHours(): string {
    return this._parsedHours;
  }

  get parsedMinutes(): string {
    return this._parsedMinutes;
  }

  get parsedSeconds(): string {
    return this._parsedSeconds;
  }

  get plainHours(): number {
    return this._plainHours;
  }

  get plainMinutes(): number {
    return this._plainMinutes;
  }

  get plainSeconds(): number {
    return this._plainSeconds;
  }

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
    hotkeysService: HotkeysService,
    translate: TranslateService,
    i18nService: I18nService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route, hotkeysService, translate, i18nService);

    footerBarService.TYPE_REFERENCE = CountdownComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
      footerBarService.footerElemHotkeys
    ]);
  }

  public ngAfterViewInit(): void {
    this.i18nService.initialized.pipe(takeUntil(this.destroy)).subscribe(this.loadHotkeys.bind(this));
    this.translate.onLangChange.pipe(takeUntil(this.destroy)).subscribe(this.loadHotkeys.bind(this));
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

    const target = ['/quiz', 'manager', this._isQuizPool ? 'quiz-pool' : this._questionIndex, 'overview'];
    this.footerBarService.footerElemBack.onClickCallback = () => this.router.navigate(target);

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

  private loadHotkeys(): void {
    this.hotkeysService.hotkeys = [];
    this.hotkeysService.reset();

    this.hotkeysService.add([
      new Hotkey('esc', (): boolean => {
        this.footerBarService.footerElemBack.onClickCallback();
        return false;
      }, ['INPUT'], this.translate.instant('region.footer.footer_bar.back')),
    ]);
  }
}

