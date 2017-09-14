import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  get languages(): Object[] {
    return this._languages;
  }
  private _languages: Object[] = [{
    tag: "en",
    selected: this.translateService.currentLang === "en",
    name: "English"
  },{
    tag: "de",
    selected: this.translateService.currentLang === "de",
    name: "Deutsch"
  }];

  constructor(private translateService : TranslateService, private footerBarService: FooterBarService, private headerLabelService : HeaderLabelService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemHome,
      FooterBarComponent.footerElemAbout,
      FooterBarComponent.footerElemTheme,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemHashtagManagement,
      FooterBarComponent.footerElemImport,
    ]);
    headerLabelService.setHeaderLabel("component.translation.translations");
  }

  ngOnInit() {
  }

  changeLanguage(tag: string): void {
    this.translateService.use(tag);
  }

}
