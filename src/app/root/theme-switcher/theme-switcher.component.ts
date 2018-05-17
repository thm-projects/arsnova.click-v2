import {Component, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  public static TYPE = 'ThemeSwitcherComponent';

  private previewThemeBackup: string;

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService
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
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
  }

  ngOnInit() {
  }

  updateTheme(id: string) {
    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    window.localStorage.setItem('config.default_theme', this.previewThemeBackup);
  }

  previewTheme(id) {
    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
  }

  restoreTheme() {
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;

    if (themeDataset === this.previewThemeBackup) {
      return;
    }
    this.themesService.reloadLinkNodes(this.previewThemeBackup);
  }

}
