import {Component, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {I18nService, Languages, LanguageTranslations} from '../../service/i18n.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  get availableLanguages(): Array<Object> {
    return this._availableLanguages;
  }

  private _availableLanguages: Array<Object> = [];

  constructor(
    public i18nService: I18nService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.headerLabel = 'component.translation.translations';
    Object.keys(Languages).forEach((lang) => {
      this._availableLanguages.push({
        text: LanguageTranslations[lang],
        tag: lang
      });
    });
  }

  ngOnInit() {
  }

  changeLanguage(tag: string): void {
    this.i18nService.setLanguage(Languages[tag]);
  }

}
