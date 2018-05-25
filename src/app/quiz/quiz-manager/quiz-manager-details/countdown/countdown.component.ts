import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { Subscription } from 'rxjs';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  public static TYPE = 'CountdownComponent';
  public minCountdownValue = 10;

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

  private _countdown: number = this.minCountdownValue;

  get countdown(): number {
    return this._countdown;
  }

  private _questionIndex: number;
  private _question: IQuestion;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = CountdownComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemProductTour,
    ]);
  }

  public updateCountdown(event: Event | number): void {
    if (typeof event === 'number') {
      this._countdown = event;
    } else {
      this._countdown = parseInt((<HTMLInputElement>(<Event>event).target).value, 10);
    }
    const hours = Math.floor(this._countdown / 3600);
    const minutes = Math.floor((this._countdown - hours * 3600) / 60);
    const seconds = Math.floor((this._countdown - hours * 3600) - (minutes * 60));

    this._parsedHours = hours > 0 && hours < 10 ? '0' + hours : String(hours);
    this._parsedMinutes = minutes > 0 && minutes < 10 ? '0' + minutes : String(minutes);
    this._parsedSeconds = seconds > 0 && seconds < 10 ? '0' + seconds : String(seconds);

    this._plainHours = parseInt(this._parsedHours, 10);
    this._plainMinutes = parseInt(this._parsedMinutes, 10);
    this._plainSeconds = parseInt(this._parsedSeconds, 10);

    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].timer = this.countdown;
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this.updateCountdown(this._question.timer);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy(): void {
    this.activeQuestionGroupService.persist();
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}

