import { Component, EventEmitter, Output } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { QuestiontextComponent } from '../../quiz/quiz-manager/details/questiontext/questiontext.component';
import { TrackingService } from '../../service/tracking/tracking.service';

class MarkdownBarElement {
  private _iconClass: IconName;

  get iconClass(): IconName {
    return this._iconClass;
  }

  set iconClass(value: IconName) {
    this._iconClass = value;
  }

  get customIcon(): boolean {
    return this._customIcon;
  }

  get hiddenByDefault(): boolean {
    return this._hiddenByDefault;
  }

  get id(): string {
    return this._id;
  }

  get titleRef(): string {
    return this._titleRef;
  }

  private _iconClassToggled: IconName;

  get iconClassToggled(): IconName {
    return this._iconClassToggled;
  }

  set iconClassToggled(value: IconName) {
    this._iconClassToggled = value;
  }

  private readonly _customIcon: boolean;

  private readonly _id: string;
  private readonly _titleRef: string;
  private readonly _hiddenByDefault: boolean;

  constructor({ id, titleRef, iconClass, iconClassToggled = iconClass, hiddenByDefault = false, customIcon = false }) {
    this._id = id;
    this._titleRef = titleRef;
    this._iconClass = iconClass;
    this._customIcon = customIcon;
    this._iconClassToggled = iconClassToggled;
    this._hiddenByDefault = hiddenByDefault;
  }
}

/* Visible Markdown buttons by default */
const BoldMarkdownButton = new MarkdownBarElement({
  id: 'boldMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.bold',
  iconClass: 'bold',
});
const HeaderMarkdownButton = new MarkdownBarElement({
  id: 'headerMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.heading',
  iconClass: 'heading',
});
const HyperlinkMarkdownButton = new MarkdownBarElement({
  id: 'hyperlinkMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.hyperlink',
  iconClass: 'globe',
});
const UlMarkdownButton = new MarkdownBarElement({
  id: 'unsortedListMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.unordered_list',
  iconClass: 'list-ul',
});
const CodeMarkdownButton = new MarkdownBarElement({
  id: 'codeMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.code',
  iconClass: 'code',
});
const ImageMarkdownButton = new MarkdownBarElement({
  id: 'imageMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.image',
  iconClass: 'image',
});
const ShowMoreMarkdownButton = new MarkdownBarElement({
  id: 'showMoreMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.show_more',
  iconClass: 'caret-square-down',
  iconClassToggled: 'caret-square-up',
});

/* Hidden Markdown buttons - visible only by clicking on ShowMoreMarkdownButton */
const LatexMarkdownButton = new MarkdownBarElement({
  id: 'latexMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.latex',
  iconClass: 'latexIcon',
  customIcon: true,
  hiddenByDefault: true,
});
const StrikeThroughMarkdownButton = new MarkdownBarElement({
  id: 'strikeThroughMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.strike_through',
  iconClass: 'strikethrough',
  hiddenByDefault: true,
});
const ItalicMarkdownButton = new MarkdownBarElement({
  id: 'italicMarkdownButton',
  titleRef: 'plugins.markdown_bar.tooltip.italic',
  iconClass: 'italic',
  hiddenByDefault: true,
});


@Component({
  selector: 'app-markdown-bar',
  templateUrl: './markdown-bar.component.html',
  styleUrls: ['./markdown-bar.component.scss'],
})
export class MarkdownBarComponent {
  public static readonly TYPE = 'MarkdownBarComponent';
  public markdownBarElements = Array<MarkdownBarElement>();
  @Output() public connectorEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private translateService: TranslateService, private trackingService: TrackingService) {
    this.markdownBarElements.push(BoldMarkdownButton, HeaderMarkdownButton, HyperlinkMarkdownButton, UlMarkdownButton, CodeMarkdownButton,
      ImageMarkdownButton, LatexMarkdownButton, StrikeThroughMarkdownButton, ItalicMarkdownButton);
  }

  public connector(elem: MarkdownBarElement): void {
    this.trackingService.trackClickEvent({
      action: QuestiontextComponent.TYPE,
      label: `markdown-button`,
      customDimensions: {
        dimension1: elem.id,
      },
    });
    this.connectorEmitter.emit(elem.id);
  }
}
