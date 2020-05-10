import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMQ } from 'ng2-simple-mq';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Language } from '../../lib/enums/enums';
import { MessageProtocol } from '../../lib/enums/Message';
import { ITweetEntry } from '../../lib/interfaces/ITweetEntry';
import { TwitterService } from '../../service/twitter/twitter.service';

@Component({
  selector: 'app-twitter-cards',
  templateUrl: './twitter-cards.component.html',
  styleUrls: ['./twitter-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitterCardsComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'TwitterCardsComponent';

  private readonly _messageSubscriptions: Array<string> = [];
  private readonly _destroy$ = new Subject();

  public warning: string;
  public limit = 8;
  public readonly Language = Language;

  constructor(
    private twitterService: TwitterService,
    private messageQueue: SimpleMQ,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    this.translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe(() => this.cd.markForCheck());
  }

  public ngOnInit(): void {
    this.twitterService.refreshTweets().subscribe(() => this.cd.markForCheck());

    this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.RequestTweets, () => {
      this.twitterService.refreshTweets().subscribe(() => this.cd.markForCheck());
    }));
  }

  public ngOnDestroy(): void {
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
    this._destroy$.next();
    this._destroy$.complete();
  }

  public getTweets(): Observable<Array<ITweetEntry>> {
    return this.twitterService.tweets.asObservable();
  }
}
