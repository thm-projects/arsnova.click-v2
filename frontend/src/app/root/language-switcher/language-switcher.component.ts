import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  get languages(): Object[] {
    return this._languages;
  }

  private _languages: Object[] = [
    {
      tag: 'en',
      selected: this.translateService.currentLang === 'en',
      name: 'English'
    }, {
      tag: 'de',
      selected: this.translateService.currentLang === 'de',
      name: 'Deutsch'
    }
  ];

  constructor(
    private translateService: TranslateService,
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
    headerLabelService.setHeaderLabel('component.translation.translations');
  }

  ngOnInit() {
  }

  changeLanguage(tag: string): void {
    this.translateService.use(tag);
  }

}
