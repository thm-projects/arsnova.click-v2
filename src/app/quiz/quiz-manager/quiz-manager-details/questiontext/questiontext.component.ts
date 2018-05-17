import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {QuestionTextService} from '../../../../service/question-text.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../../../environments/environment';
import {HeaderLabelService} from '../../../../service/header-label.service';

@Component({
  selector: 'app-questiontext',
  templateUrl: './questiontext.component.html',
  styleUrls: ['./questiontext.component.scss']
})
export class QuestiontextComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuestiontextComponent';

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private questionTextElement: HTMLTextAreaElement;
  private _questionIndex: number;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private footerBarService: FooterBarService,
    private questionTextService: QuestionTextService,
    private route: ActivatedRoute
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestiontextComponent.TYPE;
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour
    ]);
  }

  private insertMarkupSymbol(symbol: string) {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}${symbol}${selected}${symbol}${post}`;
  }

  private removeMarkupSymbol(length: number) {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}${selected}${post}`;
  }

  private wrapMarkdownSymbol(symbol: string) {
    const symbolLength = symbol.length;
    if (this.questionTextElement.value.substr(this.questionTextElement.selectionStart - symbolLength, symbolLength) === symbol) {
      this.removeMarkupSymbol(symbolLength);
    } else {
      this.insertMarkupSymbol(symbol);
    }
  }

  private prependMarkdownSymbol(symbol: string, maxSymbolCount: number) {
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

  private wrapWithLinkSymbol() {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}[${selected}](${selected})${post}`;
  }

  private wrapWithImageSymbol() {
    const selectionStart = this.questionTextElement.selectionStart;
    const selectionEnd = this.questionTextElement.selectionEnd;
    const pre = this.questionTextElement.value.substr(0, selectionStart - length);
    const selected = this.questionTextElement.value.substring(selectionStart, selectionEnd);
    const post = this.questionTextElement.value.substr(selectionEnd + length, this.questionTextElement.value.length);

    this.questionTextElement.value = `${pre}![${selected}](${selected})${post}`;
  }

  connector(event) {
    switch (event) {
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

  computeQuestionTextInputHeight() {
    const questionTextElem = <HTMLInputElement>document.getElementById('questionText');
    const lineHeight = window.getComputedStyle(questionTextElem).getPropertyValue('line-height').replace('px', '');
    questionTextElem.style.height = (parseInt(lineHeight, 10)) * (questionTextElem.value.split('\n').length + 2) + 'px';
  }

  fireEvent(event) {
    this.computeQuestionTextInputHeight();
    this.questionTextService.change(event.target.value);
    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].questionText = event.target.value;
    this.activeQuestionGroupService.persist();
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
    });
    this.questionTextElement = <HTMLTextAreaElement>document.getElementById('questionText');
    this.questionTextElement.value = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].questionText;
    this.questionTextService.change(this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].questionText);
    this.computeQuestionTextInputHeight();
  }

  ngOnDestroy() {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
    this.questionTextService.change(this.questionTextElement.value);
    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].questionText = this.questionTextElement.value;
    this.activeQuestionGroupService.persist();
  }
}
