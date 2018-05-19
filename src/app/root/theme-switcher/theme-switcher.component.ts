import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  public static TYPE = 'ThemeSwitcherComponent';

  private previewThemeBackup: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
  ) {

    this.footerBarService.TYPE_REFERENCE = ThemeSwitcherComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.headerLabel = 'component.theme_switcher.set_theme';
    if (isPlatformBrowser(this.platformId)) {
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    }
  }

  ngOnInit() {
  }

  updateTheme(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
      window.localStorage.setItem('config.default_theme', this.previewThemeBackup);
    }
  }

  previewTheme(id) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    }
  }

  restoreTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

      document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;

      if (themeDataset === this.previewThemeBackup) {
        return;
      }

      this.themesService.reloadLinkNodes(this.previewThemeBackup);
    }
  }

}
