import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ThemesService} from '../service/themes.service';
import {DefaultSettings} from '../service/settings.service';

@Component({
             selector: 'app-themes',
             templateUrl: './themes.component.html',
             styleUrls: ['./themes.component.scss']
           })
export class ThemesComponent implements OnInit, OnDestroy {

  @Output() updateTheme = new EventEmitter<string>();
  @Output() previewTheme = new EventEmitter<string>();
  @Output() restoreTheme = new EventEmitter<string>();

  constructor(
    private translateService: TranslateService,
    public themesService: ThemesService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.themesService.updateCurrentlyUsedTheme();
  }

  getThemePreviewUrl(id: string): string {
    return `${DefaultSettings.httpApiEndpoint}/theme/${id}/${this.translateService.currentLang}`;
  }

  change(id: string): void {
    this.updateTheme.emit(id);
  }

  preview(id: string): void {
    this.previewTheme.emit(id);
  }

  restore(): void {
    this.restoreTheme.emit();
  }

}
