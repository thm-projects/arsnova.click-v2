import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
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
  public tweets: ITweetEntry[] = [];
  public readonly strWindowFeatures = 'location=yes,resizable=yes,scrollbars=yes,status=yes,width=500,height=500';
  public readonly genericMessages: Array<string> = ['component.twitter.tweet.content.0'];

  private _questionIndex = -1;

  set questionIndex(value: number) {
    this._questionIndex = value;
    this.rebuildTwitterMessage();
  }

  private _digest: string;
  private _quizName: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private twitterApiService: TwitterApiService,
    private quizService: QuizService,
    private themesService: ThemesService,
    private customMarkdown: CustomMarkdownService,
    private translate: TranslateService,
  ) {
    this.quizService.quizUpdateEmitter.pipe(filter(quiz => Boolean(quiz))).subscribe(quiz => {
      this._quizName = quiz.name;
    });
  }

  public setOptIn(): void {
    localStorage.setItem(StorageKey.TwitterOptIn, 'true');
    this.refreshTweets();
  }

  public refreshTweets(): void {
    if (!this.getOptIn()) {
      return;
    }

    this.twitterApiService.getTweets().subscribe((data) => {
      this.tweets = data;
    });
  }

  public getOptIn(): boolean {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    return JSON.parse(localStorage.getItem(StorageKey.TwitterOptIn));
  }

  public tweet(): void {
    window.open(
      `https://twitter.com/compose/tweet?text=${encodeURIComponent(this.selectMessage())}&url=${this.getUrl()}&hashtags=${encodeURIComponent(
        'arsnova')}&related=arsnovaclick`, 'newwindow', this.strWindowFeatures);
  }

  private selectMessage(): string {
    const random: number = Math.floor(Math.random() * this.genericMessages.length);
    return this.translate.instant(this.genericMessages[random], { NAME: this._quizName });
  }

  private rebuildTwitterMessage(): void {
    if (this._questionIndex === -1 || !this.quizService.quiz) {
      return;
    }

    const questionText = this.quizService.quiz.questionList[this._questionIndex].questionText;
    const htmlContent: string = this.customMarkdown.parseGithubFlavoredMarkdown(questionText);
    const theme: string = this.themesService.currentTheme;

    this.twitterApiService.getQuestionImageDigest(htmlContent, theme).subscribe(digest => this._digest = digest);
  }

  private getUrl(): string {
    const url = `${DefaultSettings.httpLibEndpoint}/quiz/twitterPost/${this._digest}/${encodeURIComponent(this._quizName)}`;
    return encodeURI(url);
  }
}
