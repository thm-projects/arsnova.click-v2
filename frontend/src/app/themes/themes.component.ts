import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FooterBarComponent} from '../footer/footer-bar/footer-bar.component';
import {FooterBarService} from '../service/footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {HeaderLabelService} from '../service/header-label.service';
import {ThemesService} from '../service/themes.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit, OnDestroy {

  @Output() updateTheme = new EventEmitter<string>();
  @Output() previewTheme = new EventEmitter<string>();
  @Output() restoreTheme = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
              public themesService: ThemesService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.themesService.updateCurrentlyUsedTheme();
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
