import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemesService } from '../service/themes/themes.service';
import { CategoryType, TrackingService } from '../service/tracking/tracking.service';

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
  ) {
    this._currentTheme = this.themesService.currentTheme;
  }

  public ngOnDestroy(): void {
    this.themesService.updateCurrentlyUsedTheme();
  }

  public isThemeSelected(id: string): boolean {
    return this._currentTheme === id;
  }

  public getThemePreviewUrl(id: string): string {
    return `/assets/images/theme/${id}/preview_${this.translateService.currentLang}.jpeg`;
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
      category: CategoryType.THEME_CHANGE,
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
      category: CategoryType.THEME_PREVIEW,
      label: id,
    });
  }

  public restore(): void {
    this.restoreTheme.emit();
  }

}
