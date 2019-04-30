import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TrackingCategoryType } from '../../lib/enums/enums';
import { ThemesApiService } from '../service/api/themes/themes-api.service';
import { ThemesService } from '../service/themes/themes.service';
import { TrackingService } from '../service/tracking/tracking.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
})
export class ThemesComponent implements OnDestroy {
  public static TYPE = 'ThemesComponent';
  @Output() public updateTheme = new EventEmitter<string>();
  @Output() public previewTheme = new EventEmitter<string>();
  @Output() public restoreTheme = new EventEmitter<string>();
  private _currentTheme: string;

  constructor(
    private translateService: TranslateService,
    public themesService: ThemesService,
    private trackingService: TrackingService,
    private themesApiService: ThemesApiService,
  ) {
    this._currentTheme = this.themesService.currentTheme;
  }

  public ngOnDestroy(): void {
    this.themesService.updateCurrentlyUsedTheme();
  }

  public isThemeSelected(id: string): boolean {
    return this._currentTheme === id;
  }

  public getThemePreviewUrl(id: string): Array<string> {
    return this.themesApiService.THEMES_PREVIEW_GET_URL(id, this.translateService.currentLang);
  }

  public getFallbackPreviewUrl(id: string): string {
    return this.themesApiService.getThemePreviewDefaultUrl(id, this.translateService.currentLang);
  }

  public change(id: string): void {
    if (this._currentTheme === id) {
      return;
    }

    this.updateTheme.emit(id);
    this._currentTheme = id;

    this.themesService.reloadLinkNodes(id);

    this.trackingService.trackEvent({
      action: ThemesComponent.TYPE,
      category: TrackingCategoryType.ThemeChange,
      label: id,
    });
  }

  public preview(id: string): void {
    if (this._currentTheme === id) {
      return;
    }

    this.previewTheme.emit(id);

    this.themesService.reloadLinkNodes(id);

    this.trackingService.trackEvent({
      action: ThemesComponent.TYPE,
      category: TrackingCategoryType.ThemePreview,
      label: id,
    });
  }

  public restore(): void {
    this.restoreTheme.emit();
  }

}
