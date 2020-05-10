import { Component } from '@angular/core';
import { Language, LanguageTranslation } from '../../lib/enums/enums';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  public static readonly TYPE = 'LanguageSwitcherComponent';

  private _availableLanguage: Array<{ text: LanguageTranslation, tag: string }> = [];

  get availableLanguage(): Array<{ text: LanguageTranslation, tag: string }> {
    return this._availableLanguage;
  }

  constructor(
    public i18nService: I18nService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private trackingService: TrackingService,
  ) {

    this.footerBarService.TYPE_REFERENCE = LanguageSwitcherComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome, this.footerBarService.footerElemAbout, this.footerBarService.footerElemTheme,
    ]);
    headerLabelService.headerLabel = 'component.translation.translations';
    Object.keys(Language).forEach((lang) => {
      this._availableLanguage.push({
        text: LanguageTranslation[lang],
        tag: lang,
      });
    });
  }

  public changeLanguage(tag: string): void {
    this.i18nService.setLanguage(Language[tag]);
    this.trackingService.trackClickEvent({
      action: LanguageSwitcherComponent.TYPE,
      label: `language-${tag}`,
    });
  }

}
