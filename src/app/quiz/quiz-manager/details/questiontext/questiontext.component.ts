import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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

  private _questionIndex: number;
  @ViewChild('questionText') private textarea: ElementRef;

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
      this.footerBarService.footerElemBack,
    ]);
  }

  public connector(markdownFeature: string): void {
    switch (markdownFeature) {
      case 'boldMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('**', '**')) {
          this.insertInQuestionText('**', '**');
        }
        break;
      case 'strikeThroughMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('~~', '~~')) {
          this.insertInQuestionText('~~', '~~');
        }
        break;
      case 'italicMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('*', '*')) {
          this.insertInQuestionText('', '*');
        }
        break;
      case 'headerMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('### ', '')) {
          if (this.markdownAlreadyExistsAndAutoRemove('## ', '')) {
            this.insertInQuestionText('### ', '');
          } else {
            if (this.markdownAlreadyExistsAndAutoRemove('# ', '')) {
              this.insertInQuestionText('## ', '');
            } else {
              this.insertInQuestionText('# ', '');
            }
          }
        }
        break;
      case 'hyperlinkMarkdownButton':
        this.wrapWithLinkSymbol();
        break;
      case 'imageMarkdownButton':
        this.wrapWithImageSymbol();
        break;
      case 'codeMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('```\n', '\n```')) {
          this.insertInQuestionText('```\n', '\n```');
        }
        break;
      case 'ulMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('- ')) {
          this.insertInQuestionText('- ');
        }
        break;
      case 'latexMarkdownButton':
        if (!this.markdownAlreadyExistsAndAutoRemove('$$', '$$')) {
          if (!this.markdownAlreadyExistsAndAutoRemove('$', '$')) {
            this.insertInQuestionText('$$', '$$');
          }
        } else {
          this.insertInQuestionText('$', '$');
        }
        break;
    }

    this.questionTextService.change(this.textarea.nativeElement.value);
  }

  public fireEvent(event: Event): void {
    this.questionTextService.change((<HTMLTextAreaElement>event.target).value);
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
    });

    if (isPlatformBrowser(this.platformId)) {

      this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
        if (!quiz) {
          return;
        }

        this.textarea.nativeElement.value = this.quizService.quiz.questionList[this._questionIndex].questionText;
        this.questionTextService.change(this.quizService.quiz.questionList[this._questionIndex].questionText);
      }));

      this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));

      const contentContainer = document.getElementById('content-container');

      if (contentContainer) {
        contentContainer.classList.remove('container');
        contentContainer.classList.add('container-fluid');
      }
    }
  }

  public ngOnDestroy(): void {
    this.questionTextService.change(this.textarea.nativeElement.value);
    this.quizService.quiz.questionList[this._questionIndex].questionText = this.textarea.nativeElement.value;
    this.quizService.persist();

    if (isPlatformBrowser(this.platformId)) {
      const contentContainer = document.getElementById('content-container');

      if (contentContainer) {
        contentContainer.classList.add('container');
        contentContainer.classList.remove('container-fluid');
      }
    }
  }

  private wrapWithLinkSymbol(): void {
    const selectionStart = this.textarea.nativeElement.selectionStart;
    const selectionEnd = this.textarea.nativeElement.selectionEnd;
    const pre = this.textarea.nativeElement.value.substr(0, selectionStart - length);
    const selected = this.textarea.nativeElement.value.substring(selectionStart, selectionEnd);
    const post = this.textarea.nativeElement.value.substr(selectionEnd + length, this.textarea.nativeElement.value.length);

    this.textarea.nativeElement.value = `${pre}[${selected}](${selected})${post}`;
  }

  private wrapWithImageSymbol(): void {
    const selectionStart = this.textarea.nativeElement.selectionStart;
    const selectionEnd = this.textarea.nativeElement.selectionEnd;
    const pre = this.textarea.nativeElement.value.substr(0, selectionStart - length);
    const selected = this.textarea.nativeElement.value.substring(selectionStart, selectionEnd);
    const post = this.textarea.nativeElement.value.substr(selectionEnd + length, this.textarea.nativeElement.value.length);

    this.textarea.nativeElement.value = `${pre}![${selected}](${selected})${post}`;
  }

  private insertInQuestionText(textStart, textEnd?): void {
    textEnd = typeof textEnd !== 'undefined' ? textEnd : '';

    const scrollPos = this.textarea.nativeElement.scrollTop;
    const strPosBegin = this.textarea.nativeElement.selectionStart;
    const strPosEnd = this.textarea.nativeElement.selectionEnd;
    const frontText = (this.textarea.nativeElement.value).substring(0, strPosBegin);
    const backText = (this.textarea.nativeElement.value).substring(strPosEnd, this.textarea.nativeElement.value.length);
    const selectedText = (this.textarea.nativeElement.value).substring(strPosBegin, strPosEnd);

    this.textarea.nativeElement.value = frontText + textStart + selectedText + textEnd + backText;
    this.textarea.nativeElement.selectionStart = strPosBegin + textStart.length;
    this.textarea.nativeElement.selectionEnd = strPosEnd + textStart.length;
    this.textarea.nativeElement.focus();
    this.textarea.nativeElement.scrollTop = scrollPos;
  }

  private markdownAlreadyExistsAndAutoRemove(textStart, textEnd?): boolean {

    // fix for IE / Edge: get dismissed focus back to retrieve selection values
    this.textarea.nativeElement.focus();

    const scrollPos = this.textarea.nativeElement.scrollTop;
    const strPosBegin = this.textarea.nativeElement.selectionStart;
    const strPosEnd = this.textarea.nativeElement.selectionEnd;

    textEnd = typeof textEnd !== 'undefined' ? textEnd : '';
    let textEndExists = false;
    let textStartExists = false;

    if (textEnd.length > 0) {
      if ((this.textarea.nativeElement.value).substring(strPosEnd, strPosEnd + textEnd.length) === textEnd) {
        textEndExists = true;
      }
    } else {
      textEndExists = true;
    }

    if ((this.textarea.nativeElement.value).substring(strPosBegin - textStart.length, strPosBegin) === textStart) {
      textStartExists = true;
    }

    if (textStartExists && textEndExists) {
      const frontText = (this.textarea.nativeElement.value).substring(0, strPosBegin - textStart.length);
      const middleText = (this.textarea.nativeElement.value).substring(strPosBegin, strPosEnd);
      const backText = (this.textarea.nativeElement.value).substring(strPosEnd + textEnd.length, this.textarea.nativeElement.value.length);

      this.textarea.nativeElement.value = frontText + middleText + backText;
      this.textarea.nativeElement.selectionStart = strPosBegin - textStart.length;
      this.textarea.nativeElement.selectionEnd = strPosEnd - (textEnd.length === 0 ? textStart.length : textEnd.length);
      this.textarea.nativeElement.focus();
      this.textarea.nativeElement.scrollTop = scrollPos;

      return true;
    }
    return false;
  }

}
