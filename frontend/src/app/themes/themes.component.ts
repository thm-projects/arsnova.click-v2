import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FooterBarComponent} from "../footer/footer-bar/footer-bar.component";
import {FooterBarService} from "../service/footer-bar.service";
import {TranslateService} from "@ngx-translate/core";
import {HeaderLabelService} from "../service/header-label.service";

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  get themes(): Array<Object> {
    return this._themes;
  }
  private _themes: Array<Object> = [
    {
      name: "component.theme_switcher.themes.material.name",
      description: "component.theme_switcher.themes.material.description",
      id: "theme-Material"
    },
    {
      name: "component.theme_switcher.themes.theme-arsnova-dot-click-contrast.name",
      description: "component.theme_switcher.themes.theme-arsnova-dot-click-contrast.description",
      id: "theme-arsnova-dot-click-contrast"
    },
    {
      name: "component.theme_switcher.themes.black_beauty.name",
      description: "component.theme_switcher.themes.black_beauty.description",
      id: "theme-blackbeauty"
    },
    {
      name: "component.theme_switcher.themes.elegant.name",
      description: "component.theme_switcher.themes.elegant.description",
      id: "theme-elegant"
    },
    {
      name: "component.theme_switcher.themes.decent_blue.name",
      description: "component.theme_switcher.themes.decent_blue.description",
      id: "theme-decent-blue"
    },
    {
      name: "component.theme_switcher.themes.material_hope.name",
      description: "component.theme_switcher.themes.material_hope.description",
      id: "theme-Material-hope"
    },
    {
      name: "component.theme_switcher.themes.material-blue.name",
      description: "component.theme_switcher.themes.material-blue.description",
      id: "theme-Material-blue"
    },
    {
      name: "component.theme_switcher.themes.spiritual-purple.name",
      description: "component.theme_switcher.themes.spiritual-purple.description",
      id: "theme-spiritual-purple"
    },
    {
      name: "component.theme_switcher.themes.GreyBlue-Lime.name",
      description: "component.theme_switcher.themes.GreyBlue-Lime.description",
      id: "theme-GreyBlue-Lime"
    }
  ];

  private previewThemeBackup: string = "";
  @Output()updateTheme = new EventEmitter<string>();
  @Output()previewTheme = new EventEmitter<string>();
  @Output()restoreTheme = new EventEmitter<string>();

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
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
