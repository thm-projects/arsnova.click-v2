import { Component, OnInit } from '@angular/core';
import { SimpleMQ } from 'ng2-simple-mq';
import { MessageProtocol } from '../../lib/enums/Message';
import { TwitterService } from '../../service/twitter/twitter.service';

@Component({
  selector: 'app-twitter-cards',
  templateUrl: './twitter-cards.component.html',
  styleUrls: ['./twitter-cards.component.scss'],
})
export class TwitterCardsComponent implements OnInit {

  public static TYPE = 'TwitterCardsComponent';
  public warning: string;

  constructor(public twitterService: TwitterService, private messageQueue: SimpleMQ) {}

  public goToTwitter(url: string): void {
    window.open(url, '_blank');
  }

  public ngOnInit(): void {
    this.twitterService.refreshTweets();

    this.messageQueue.subscribe(MessageProtocol.RequestTweets, () => {
      this.twitterService.refreshTweets();
    });
  }
}
