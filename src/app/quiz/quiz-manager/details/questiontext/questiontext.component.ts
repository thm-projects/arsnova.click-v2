import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../../../environments/environment';
import { AutoUnsubscribe } from '../../../../../lib/AutoUnsubscribe';
import { StorageKey } from '../../../../../lib/enums/enums';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-questiontext',
  templateUrl: './questiontext.component.html',
  styleUrls: ['./questiontext.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuestiontextComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuestiontextComponent';
  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;
  private questionTextElement: HTMLTextAreaElement;
  private _questionIndex: number;

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private footerBarService: FooterBarService,
    private questionTextService: QuestionTextService,
    private route: ActivatedRoute,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestiontextComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemNicknames,
    ]);
  }

  public connector(markdownFeature: string): void {
    switch (markdownFeature) {
      case 'boldMarkdownButton':
        this.wrapMarkdownSymbol('**');
        break;
      case 'underlineMarkdownButton':
        this.wrapMarkdownSymbol('__');
        break;
      case 'strikeThroughMarkdownButton':
        this.wrapMarkdownSymbol('~~');
        break;
      case 'italicMarkdownButton':
        this.wrapMarkdownSymbol('*');
        break;
      case 'headerMarkdownButton':
        this.prependMarkdownSymbol('#', 6);
        break;
      case 'hyperlinkMarkdownButton':
        this.wrapWithLinkSymbol();
        break;
      case 'imageMarkdownButton':
        this.wrapWithImageSymbol();
        break;
      case 'codeMarkdownButton':
        break;
      case 'ulMarkdownButton':
        break;
      case 'latexMarkdownButton':
        break;
    }

  }

  public fireEvent(event: Event): void {
    this.questionTextService.change((<HTMLTextAreaElement>event.target).value);
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
    });

    if (isPlatformBrowser(this.platformId)) {
      this.questionTextElement = <HTMLTextAreaElement>document.getElementById('questionText');

      this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
        if (!quiz) {
          return;
        }

        this.questionTextElement.value = this.quizService.quiz.questionList[this._questionIndex].questionText;
        this.questionTextService.change(this.quizService.quiz.questionList[this._questionIndex].questionText);
      }));

      this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
    }
  }

  public ngOnDestroy(): void {
    this.questionTextService.change(this.questionTextElement.value);
    this.quizService.quiz.questionList[this._questionIndex].questionText = this.questionTextElement.value;
    this.quizService.persist();
  }

  public computeQuestionTextInputHeight(): number {
    if (isPlatformBrowser(this.platformId)) {
      return this.questionTextElement.scrollHeight;
    }
  }

  private insertMarkupSymbol(symbol: string): void {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}${symbol}${selected}${symbol}${post}`;
  }

  private removeMarkupSymbol(length: number): void {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}${selected}${post}`;
  }

  private wrapMarkdownSymbol(symbol: string): void {
    const symbolLength = symbol.length;
    if (this.questionTextElement.value.substr(this.questionTextElement.selectionStart - symbolLength, symbolLength) === symbol) {
      this.removeMarkupSymbol(symbolLength);
    } else {
      this.insertMarkupSymbol(symbol);
    }
  }

  private prependMarkdownSymbol(symbol: string, maxSymbolCount: number): void {
    const fullPre = this.questionTextElement.value.substring(0, this.questionTextElement.selectionStart);
    const lineStart = fullPre.lastIndexOf('\n') + 1;
    const pre = fullPre.substring(0, lineStart);
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const currentSymbolCount = this.questionTextElement.value.substring(lineStart, selectionEnd).lastIndexOf(symbol) + 1;
    const selected = this.questionTextElement.value.substring(selectionStart, this.questionTextElement.selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);
    let symbolFinal = '';

    for (let i = 0; i < currentSymbolCount; i++) {
      symbolFinal += symbol;
    }

    if (maxSymbolCount - currentSymbolCount > 0) {
      symbolFinal += symbol;
    } else {
      symbolFinal = symbolFinal.substr(0, 1);
    }
    symbolFinal = symbolFinal.replace(/ /g, '');
    this.questionTextElement.value = `${pre}${symbolFinal} ${selected}${post}`;
  }

  private wrapWithLinkSymbol(): void {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}[${selected}](${selected})${post}`;
  }

  private wrapWithImageSymbol(): void {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}![${selected}](${selected})${post}`;
  }
}
