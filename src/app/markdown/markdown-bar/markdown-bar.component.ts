import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TrackingService} from '../../service/tracking.service';
import {QuestiontextComponent} from '../../quiz/quiz-manager/quiz-manager-details/questiontext/questiontext.component';

class MarkdownBarElement {
  get hiddenByDefault(): boolean {
    return this._hiddenByDefault;
  }

  set iconClass(value: string) {
    this._iconClass = value;
  }

  set iconClassToggled(value: string) {
    this._iconClassToggled = value;
  }

  get iconClassToggled(): string {
    return this._iconClassToggled;
  }

  get id(): string {
    return this._id;
  }

  get titleRef(): string {
    return this._titleRef;
  }

  get iconClass(): string {
    return this._iconClass;
  }

  private readonly _id: string;
  private readonly _titleRef: string;
  private _iconClass: string;
  private _iconClassToggled: string;
  private readonly _hiddenByDefault: boolean;

  constructor({id, titleRef, iconClass, iconClassToggled = iconClass, hiddenByDefault = false}) {
    this._id = id;
    this._titleRef = titleRef;
    this._iconClass = iconClass;
    this._iconClassToggled = iconClassToggled;
    this._hiddenByDefault = hiddenByDefault;
  }
}

/* Visible Markdown buttons by default */
const BoldMarkdownButton = new MarkdownBarElement({
  id: 'boldMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.bold',
  iconClass: 'fas fa-bold'
});
const HeaderMarkdownButton = new MarkdownBarElement({
  id: 'headerMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.heading',
  iconClass: 'fas fa-heading'
});
const HyperlinkMarkdownButton = new MarkdownBarElement({
  id: 'hyperlinkMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.hyperlink',
  iconClass: 'fas fa-globe'
});
const UlMarkdownButton = new MarkdownBarElement({
  id: 'unsortedListMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.unordered_list',
  iconClass: 'fas fa-list-ul'
});
const CodeMarkdownButton = new MarkdownBarElement({
  id: 'codeMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.code',
  iconClass: 'fas fa-code'
});
const ImageMarkdownButton = new MarkdownBarElement({
  id: 'imageMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.image',
  iconClass: 'fas fa-image'
});
const ShowMoreMarkdownButton = new MarkdownBarElement({
  id: 'showMoreMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.show_more',
  iconClass: 'far fa-caret-square-down',
  iconClassToggled: 'far fa-caret-square-up'
});

/* Hidden Markdown buttons - visible only by clicking on ShowMoreMarkdownButton */
const LatexMarkdownButton = new MarkdownBarElement({
  id: 'latexMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.latex',
  iconClass: 'latexIcon',
  hiddenByDefault: true
});
const UnderlineMarkdownButton = new MarkdownBarElement({
  id: 'underlineMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.underline',
  iconClass: 'fas fa-underline',
  hiddenByDefault: true
});
const StrikeThroughMarkdownButton = new MarkdownBarElement({
  id: 'strikeThroughMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.strike_through',
  iconClass: 'fas fa-strikethrough',
  hiddenByDefault: true
});
const ItalicMarkdownButton = new MarkdownBarElement({
  id: 'italicMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.italic',
  iconClass: 'fas fa-italic',
  hiddenByDefault: true
});


@Component({
  selector: 'app-markdown-bar',
  templateUrl: './markdown-bar.component.html',
  styleUrls: ['./markdown-bar.component.scss']
})
export class MarkdownBarComponent implements OnInit, OnDestroy {
  public static TYPE = 'MarkdownBarComponent';

  get showHiddenMarkdownButtons(): boolean {
    return this._showHiddenMarkdownButtons;
  }

  set showHiddenMarkdownButtons(value: boolean) {
    this._showHiddenMarkdownButtons = value;
  }

  public markdownBarElements = Array<MarkdownBarElement>();
  public hiddenMarkdownBarElements = Array<MarkdownBarElement>();
  public allDisplayedMarkdownBarElements = Array<MarkdownBarElement>();
  private _showHiddenMarkdownButtons = false;

  @Output() connectorEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private translateService: TranslateService,
    private trackingService: TrackingService
  ) {
    this.markdownBarElements.push(
      BoldMarkdownButton,
      HeaderMarkdownButton,
      HyperlinkMarkdownButton,
      UlMarkdownButton,
      CodeMarkdownButton,
      ImageMarkdownButton,
      ShowMoreMarkdownButton
    );
    this.hiddenMarkdownBarElements.push(
      LatexMarkdownButton,
      UnderlineMarkdownButton,
      StrikeThroughMarkdownButton,
      ItalicMarkdownButton
    );
    this.allDisplayedMarkdownBarElements = this.markdownBarElements;
  }

  connector(elem: MarkdownBarElement) {
    switch (elem.id) {
      case 'showMoreMarkdownButton':
        this.showHiddenMarkdownButtons = !this.showHiddenMarkdownButtons;
        if (this.showHiddenMarkdownButtons) {
          this.allDisplayedMarkdownBarElements = this.allDisplayedMarkdownBarElements.concat(this.hiddenMarkdownBarElements);
          this.trackingService.trackClickEvent({
            action: QuestiontextComponent.TYPE,
            label: `show-markdown-buttons`
          });
        } else {
          this.trackingService.trackClickEvent({
            action: QuestiontextComponent.TYPE,
            label: `hide-markdown-buttons`
          });
          this.allDisplayedMarkdownBarElements = this.allDisplayedMarkdownBarElements.filter(function (value) {
            return !value.hiddenByDefault;
          });
        }
        this.flipIconClasses(ShowMoreMarkdownButton);
        break;
      default:
        this.trackingService.trackClickEvent({
          action: QuestiontextComponent.TYPE,
          label: `markdown-button`,
          customDimensions: {
            dimension1: elem.id
          }
        });
    }
    this.connectorEmitter.emit(elem.id);
  }

  flipIconClasses(elem: MarkdownBarElement) {
    const iconClass = elem.iconClass;
    elem.iconClass = elem.iconClassToggled;
    elem.iconClassToggled = iconClass;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.showHiddenMarkdownButtons) {
      this.flipIconClasses(ShowMoreMarkdownButton);
    }
  }

}
