import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ThemesService} from '../service/themes.service';
import {DefaultSettings} from '../../lib/default.settings';
import {CategoryType, TrackingService} from '../service/tracking.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit, OnDestroy {
  public static TYPE = 'ThemesComponent';

  @Output() updateTheme = new EventEmitter<string>();
  @Output() previewTheme = new EventEmitter<string>();
  @Output() restoreTheme = new EventEmitter<string>();

  private _currentTheme: string;

  constructor(
    private translateService: TranslateService,
    public themesService: ThemesService,
    private trackingService: TrackingService
  ) {
    this._currentTheme = this.themesService.currentTheme;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.themesService.updateCurrentlyUsedTheme();
  }

  isThemeSelected(id: string): boolean {
    return this._currentTheme === id;
  }

  getThemePreviewUrl(id: string): string {
    return `${DefaultSettings.httpApiEndpoint}/themes/${id}/${this.translateService.currentLang}`;
  }

  change(id: string): void {
    if (this._currentTheme === id) {
      return;
    }

    this.updateTheme.emit(id);
    this._currentTheme = id;

    this.themesService.reloadLinkNodes(id);

    this.trackingService.trackEvent({
      action: ThemesComponent.TYPE,
      category: CategoryType.THEME_CHANGE,
      label: id
    });
  }

  preview(id: string): void {
    if (this._currentTheme === id) {
      return;
    }

    this.previewTheme.emit(id);

    this.themesService.reloadLinkNodes(id);

    this.trackingService.trackEvent({
      action: ThemesComponent.TYPE,
      category: CategoryType.THEME_PREVIEW,
      label: id
    });
  }

  restore(): void {
    this.restoreTheme.emit();
  }

}
