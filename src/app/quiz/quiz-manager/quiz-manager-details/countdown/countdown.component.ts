import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActivatedRoute} from '@angular/router';
import {IQuestion} from '../../../../../lib/questions/interfaces';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  get plainHours(): number {
    return this._plainHours;
  }

  get plainMinutes(): number {
    return this._plainMinutes;
  }

  get plainSeconds(): number {
    return this._plainSeconds;
  }

  get parsedSeconds(): string {
    return this._parsedSeconds;
  }

  get parsedMinutes(): string {
    return this._parsedMinutes;
  }

  get parsedHours(): string {
    return this._parsedHours;
  }

  get countdown(): number {
    return this._countdown;
  }

  private _questionIndex: number;
  private _question: IQuestion;
  private _routerSubscription: Subscription;
  private _parsedHours = '0';
  private _parsedMinutes = '0';
  private _parsedSeconds = '0';
  private _plainHours = 0;
  private _plainMinutes = 0;
  private _plainSeconds = 0;

  public minCountdownValue = 10;
  private _countdown: number = this.minCountdownValue;

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService) {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour
    ]);
  }

  updateCountdown(event: Event | number): void {
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

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this.updateCountdown(this._question.timer);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
    this._routerSubscription.unsubscribe();
  }

}

