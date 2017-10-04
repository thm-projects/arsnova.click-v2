import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {QuestionTextService} from '../../../service/question-text.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {LIVE_PREVIEW_ENVIRONMENT} from 'environments/environment';
import {DEVICE_TYPES} from '../../../../environments/environment';

@Component({
  selector: 'app-questiontext',
  templateUrl: './questiontext.component.html',
  styleUrls: ['./questiontext.component.scss']
})
export class QuestiontextComponent implements OnInit, OnDestroy {

  public readonly DEVICE_TYPE = DEVICE_TYPES;
  public readonly ENVIRONMENT_TYPE = LIVE_PREVIEW_ENVIRONMENT;

  private questionTextElement: HTMLTextAreaElement;
  private _questionIndex: number;
  private _routerSubscription: Subscription;

  constructor(@Inject(ActiveQuestionGroupService) private activeQuestionGroupService: ActiveQuestionGroupService,
              private footerBarService: FooterBarService,
              private questionTextService: QuestionTextService,
              private route: ActivatedRoute) {
    this.footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack,
      FooterBarComponent.footerElemNicknames
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
    }
    this.questionTextService.change(this.questionTextElement.value);
    this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex].questionText = this.questionTextElement.value;
    this.activeQuestionGroupService.persist();

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
    this._routerSubscription.unsubscribe();
  }
}
