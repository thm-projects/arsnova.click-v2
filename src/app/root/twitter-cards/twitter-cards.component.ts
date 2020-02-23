import { Component, OnDestroy, OnInit } from '@angular/core';
import { SimpleMQ } from 'ng2-simple-mq';
import { MessageProtocol } from '../../lib/enums/Message';
import { TwitterService } from '../../service/twitter/twitter.service';

@Component({
  selector: 'app-twitter-cards',
  templateUrl: './twitter-cards.component.html',
  styleUrls: ['./twitter-cards.component.scss'],
})
export class TwitterCardsComponent implements OnInit, OnDestroy {

  public static TYPE = 'TwitterCardsComponent';
  public warning: string;

  private readonly _messageSubscriptions: Array<string> = [];

  constructor(public twitterService: TwitterService, private messageQueue: SimpleMQ) {}

  public goToTwitter(url: string): void {
    window.open(url, '_blank');
  }

  public ngOnInit(): void {
    this.twitterService.refreshTweets();

    this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.RequestTweets, () => {
      this.twitterService.refreshTweets();
    }));
  }

  public ngOnDestroy(): void {
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
  }
}
