import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../../service/twitter/twitter.service';

@Component({
  selector: 'app-twitter-cards',
  templateUrl: './twitter-cards.component.html',
  styleUrls: ['./twitter-cards.component.scss'],
})
export class TwitterCardsComponent implements OnInit {

  public static TYPE = 'TwitterCardsComponent';
  public warning: string;

  constructor(public twitterService: TwitterService) {
  }

  public goToTwitter(url: string): void {
    window.open(url, '_blank');
  }

  public ngOnInit(): void {
    this.twitterService.refreshTweets();
  }
}
