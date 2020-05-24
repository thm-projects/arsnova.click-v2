import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DefaultSettings } from '../../lib/default.settings';
import { StorageKey } from '../../lib/enums/enums';
import { ITweetEntry } from '../../lib/interfaces/ITweetEntry';
import { TwitterApiService } from '../api/twitter/twitter-api.service';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';
import { QuizService } from '../quiz/quiz.service';
import { ThemesService } from '../themes/themes.service';

@Injectable({
  providedIn: 'root',
})
export class TwitterService {
  private _questionIndex = -1;
  private _digest: string;
  private _quizName: string;
  private readonly _twitterWindowFeatures = 'location=yes,resizable=yes,scrollbars=yes,status=yes,width=500,height=500';
  private readonly _genericMessages: Array<string> = ['component.twitter.tweet.content.0'];

  public showTwitter = new Subject<boolean>();
  public isShowingTwitter = false;
  public twitterEnabled = false;
  public readonly tweets = new ReplaySubject<Array<ITweetEntry>>(1);

  set questionIndex(value: number) {
    this._questionIndex = value;
    /*
     FIXME Disabled due to performance impacts
     this.rebuildTwitterMessage();
     */
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    private twitterApiService: TwitterApiService,
    private quizService: QuizService,
    private themesService: ThemesService,
    private customMarkdown: CustomMarkdownService,
    private translate: TranslateService,
    private cookieService: CookieService,
  ) {
    this.quizService.quizUpdateEmitter.pipe(filter(quiz => Boolean(quiz))).subscribe(quiz => {
      this._quizName = quiz.name;
    });

    this.showTwitter.subscribe(value => this.isShowingTwitter = value);
  }

  public setOptIn(): void {
    this.cookieService.delete(StorageKey.TwitterOptIn);
    this.cookieService.set(StorageKey.TwitterOptIn, 'true', 31536000);
    this.refreshTweets().subscribe();
  }

  public refreshTweets(): Observable<Array<ITweetEntry>> {
    if (!this.getOptIn()) {
      return of([null]);
    }

    return this.twitterApiService.getTweets().pipe(tap((data) => {
      this.tweets.next(data);
    }));
  }

  public getOptIn(): boolean {
    if (isPlatformServer(this.platformId)) {
      return Boolean(this.request.cookies[StorageKey.TwitterOptIn]);
    }

    return Boolean(this.cookieService.get(StorageKey.TwitterOptIn));
  }

  public tweet(): void {
    window.open(
      `https://twitter.com/compose/tweet?text=${encodeURIComponent(this.selectMessage())}&url=${this.getUrl()}&hashtags=${encodeURIComponent(
        'arsnova')}&related=arsnovaclick`, 'newwindow', this._twitterWindowFeatures);
  }

  private selectMessage(): string {
    const random: number = Math.floor(Math.random() * this._genericMessages.length);
    return this.translate.instant(this._genericMessages[random], { NAME: this._quizName });
  }

  private rebuildTwitterMessage(): void {
    if (this._questionIndex === -1 || !this.quizService.quiz) {
      return;
    }

    const questionText = this.quizService.quiz.questionList[this._questionIndex].questionText;
    const htmlContent: string = this.customMarkdown.parseGithubFlavoredMarkdown(questionText);
    const theme: string = this.themesService.currentTheme;

    if (!htmlContent) {
      return;
    }

    this.twitterApiService.getQuestionImageDigest(htmlContent, theme).subscribe(digest => this._digest = digest);
  }

  private getUrl(): string {
    const url = `${DefaultSettings.httpLibEndpoint}/quiz/twitterPost/${this._digest}/${encodeURIComponent(this._quizName)}`;
    return encodeURI(url);
  }
}
