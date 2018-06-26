import { Component } from '@angular/core';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { LANGUAGE, LANGUAGE_TRANSLATION } from '../../shared/enums';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  public static TYPE = 'LanguageSwitcherComponent';

  private _availableLanguage: Array<Object> = [];

  get availableLanguage(): Array<Object> {
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
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.headerLabel = 'component.translation.translations';
    Object.keys(LANGUAGE).forEach((lang) => {
      this._availableLanguage.push({
        text: LANGUAGE_TRANSLATION[lang],
        tag: lang,
      });
    });
  }

  public changeLanguage(tag: string): void {
    this.i18nService.setLanguage(LANGUAGE[tag]);
    this.trackingService.trackClickEvent({
      action: LanguageSwitcherComponent.TYPE,
      label: `language-${tag}`,
    });
  }

}
