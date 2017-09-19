import {Injectable, Renderer2} from '@angular/core';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {DefaultSettings} from './settings.service';

@Injectable()
export class ThemesService {
  private previewThemeBackup: string = '';

  get themes(): Array<Object> {
    return this._themes;
  }

  private _themes: Array<Object> = [
    {
      name: 'component.theme_switcher.themes.material.name',
      description: 'component.theme_switcher.themes.material.description',
      id: 'theme-Material'
    },
    {
      name: 'component.theme_switcher.themes.theme-arsnova-dot-click-contrast.name',
      description: 'component.theme_switcher.themes.theme-arsnova-dot-click-contrast.description',
      id: 'theme-arsnova-dot-click-contrast'
    },
    {
      name: 'component.theme_switcher.themes.black_beauty.name',
      description: 'component.theme_switcher.themes.black_beauty.description',
      id: 'theme-blackbeauty'
    },
    {
      name: 'component.theme_switcher.themes.elegant.name',
      description: 'component.theme_switcher.themes.elegant.description',
      id: 'theme-elegant'
    },
    {
      name: 'component.theme_switcher.themes.decent_blue.name',
      description: 'component.theme_switcher.themes.decent_blue.description',
      id: 'theme-decent-blue'
    },
    {
      name: 'component.theme_switcher.themes.material_hope.name',
      description: 'component.theme_switcher.themes.material_hope.description',
      id: 'theme-Material-hope'
    },
    {
      name: 'component.theme_switcher.themes.material-blue.name',
      description: 'component.theme_switcher.themes.material-blue.description',
      id: 'theme-Material-blue'
    },
    {
      name: 'component.theme_switcher.themes.spiritual-purple.name',
      description: 'component.theme_switcher.themes.spiritual-purple.description',
      id: 'theme-spiritual-purple'
    },
    {
      name: 'component.theme_switcher.themes.GreyBlue-Lime.name',
      description: 'component.theme_switcher.themes.GreyBlue-Lime.description',
      id: 'theme-GreyBlue-Lime'
    }
  ];

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService) {
    if (!window.localStorage.getItem('defaultTheme')) {
      window.localStorage.setItem('defaultTheme', DefaultSettings.defaultSettings.theme);
    }
    this.updateCurrentlyUsedTheme();
  }

  updateCurrentlyUsedTheme() {
    let usedTheme = window.localStorage.getItem('defaultTheme');
    if (this.activeQuestionGroupService.activeQuestionGroup && this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme) {
      usedTheme = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme;
    }
    if (document.body.className) {
      document.body.classList.remove(document.body.className);
    }
    document.body.className = usedTheme;
  }

}
