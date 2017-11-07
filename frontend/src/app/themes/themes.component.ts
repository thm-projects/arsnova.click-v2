import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ThemesService} from '../service/themes.service';
import {DefaultSettings} from '../../lib/default.settings';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit, OnDestroy {

  @Output() updateTheme = new EventEmitter<string>();
  @Output() previewTheme = new EventEmitter<string>();
  @Output() restoreTheme = new EventEmitter<string>();

  private _currentTheme: string;

  constructor(
    private translateService: TranslateService,
    public themesService: ThemesService) {
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
    return `${DefaultSettings.httpApiEndpoint}/theme/${id}/${this.translateService.currentLang}`;
  }

  change(id: string): void {
    this.updateTheme.emit(id);
    this._currentTheme = id;
  }

  preview(id: string): void {
    this.previewTheme.emit(id);
  }

  restore(): void {
    this.restoreTheme.emit();
  }

}
