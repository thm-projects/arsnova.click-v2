import { Component, EventEmitter, Output } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { MarkdownFeature } from '../../lib/enums/MarkdownFeature';
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

  get id(): string {
    return this._id;
  }

  get titleRef(): string {
    return this._titleRef;
  }

  get feature(): MarkdownFeature {
    return this._feature;
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
  private readonly _feature: MarkdownFeature;

  constructor({ id, titleRef, iconClass, iconClassToggled = iconClass, customIcon = false, feature }) {
    this._id = id;
    this._titleRef = titleRef;
    this._iconClass = iconClass;
    this._customIcon = customIcon;
    this._iconClassToggled = iconClassToggled;
    this._feature = feature;
  }
}

const BoldMarkdownButton = new MarkdownBarElement({
  id: 'boldMarkdownButton',
  feature: MarkdownFeature.Bold,
  titleRef: 'plugins.markdown_bar.tooltip.bold',
  iconClass: 'bold',
});
const HeaderMarkdownButton = new MarkdownBarElement({
  id: 'headerMarkdownButton',
  feature: MarkdownFeature.Header,
  titleRef: 'plugins.markdown_bar.tooltip.heading',
  iconClass: 'heading',
});
const HyperlinkMarkdownButton = new MarkdownBarElement({
  id: 'hyperlinkMarkdownButton',
  feature: MarkdownFeature.Hyperlink,
  titleRef: 'plugins.markdown_bar.tooltip.hyperlink',
  iconClass: 'globe',
});
const UlMarkdownButton = new MarkdownBarElement({
  id: 'unorderedListMarkdownButton',
  feature: MarkdownFeature.UnorderedList,
  titleRef: 'plugins.markdown_bar.tooltip.unordered_list',
  iconClass: 'list-ul',
});
const OlMarkdownButton = new MarkdownBarElement({
  id: 'orderedListMarkdownButton',
  feature: MarkdownFeature.OrderedList,
  titleRef: 'plugins.markdown_bar.tooltip.ordered_list',
  iconClass: 'list-ol',
});
const CodeMarkdownButton = new MarkdownBarElement({
  id: 'codeMarkdownButton',
  feature: MarkdownFeature.Code,
  titleRef: 'plugins.markdown_bar.tooltip.code',
  iconClass: 'code',
});
const ImageMarkdownButton = new MarkdownBarElement({
  id: 'imageMarkdownButton',
  feature: MarkdownFeature.Image,
  titleRef: 'plugins.markdown_bar.tooltip.image',
  iconClass: 'image',
});
const LatexMarkdownButton = new MarkdownBarElement({
  id: 'latexMarkdownButton',
  feature: MarkdownFeature.Latex,
  titleRef: 'plugins.markdown_bar.tooltip.latex',
  iconClass: 'latex-icon',
  customIcon: true,
});
const StrikeThroughMarkdownButton = new MarkdownBarElement({
  id: 'strikeThroughMarkdownButton',
  feature: MarkdownFeature.StrikeThrough,
  titleRef: 'plugins.markdown_bar.tooltip.strike_through',
  iconClass: 'strikethrough',
});
const ItalicMarkdownButton = new MarkdownBarElement({
  id: 'italicMarkdownButton',
  feature: MarkdownFeature.Italic,
  titleRef: 'plugins.markdown_bar.tooltip.italic',
  iconClass: 'italic',
});
const LineBreakMarkdownButton = new MarkdownBarElement({
  id: 'lineBreakMarkdownButton',
  feature: MarkdownFeature.LineBreak,
  titleRef: 'plugins.markdown_bar.tooltip.line-break',
  iconClass: 'line-break-icon',
  customIcon: true,
});
const EscapeMarkdownButton = new MarkdownBarElement({
  id: 'escapeMarkdownButton',
  feature: MarkdownFeature.Escape,
  titleRef: 'plugins.markdown_bar.tooltip.escape',
  iconClass: 'escape-icon',
  customIcon: true
});
const HrMarkdownButton = new MarkdownBarElement({
  id: 'horizontalRuleMarkdownButton',
  feature: MarkdownFeature.HorizontalRule,
  titleRef: 'plugins.markdown_bar.tooltip.horizontal-rule',
  iconClass: 'minus',
});
const InfoMarkdownButton = new MarkdownBarElement({
  id: 'infoRuleMarkdownButton',
  feature: MarkdownFeature.Info,
  titleRef: 'plugins.markdown_bar.tooltip.info',
  iconClass: 'info-circle',
});
const QuoteMarkdownButton = new MarkdownBarElement({
  id: 'quoteMarkdownButton',
  feature: MarkdownFeature.Quote,
  titleRef: 'plugins.markdown_bar.tooltip.quote',
  iconClass: 'quote-right',
});


@Component({
  selector: 'app-markdown-bar',
  templateUrl: './markdown-bar.component.html',
  styleUrls: ['./markdown-bar.component.scss'],
})
export class MarkdownBarComponent {
  public static readonly TYPE = 'MarkdownBarComponent';
  public markdownBarElements = Array<MarkdownBarElement>();
  @Output() public connectorEmitter: EventEmitter<MarkdownFeature> = new EventEmitter<MarkdownFeature>();

  constructor(private translateService: TranslateService, private trackingService: TrackingService) {
    this.markdownBarElements.push(
      BoldMarkdownButton, HeaderMarkdownButton, HyperlinkMarkdownButton, UlMarkdownButton, OlMarkdownButton,
      StrikeThroughMarkdownButton, ItalicMarkdownButton, QuoteMarkdownButton,
      CodeMarkdownButton, ImageMarkdownButton, LatexMarkdownButton, EscapeMarkdownButton, HrMarkdownButton, InfoMarkdownButton
    );
  }

  public connector(elem: MarkdownBarElement): void {
    this.trackingService.trackClickEvent({
      action: QuestiontextComponent.TYPE,
      label: elem.id,
    });
    this.connectorEmitter.emit(elem.feature);
  }
}
