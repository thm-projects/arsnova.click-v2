/*
 * This file is part of ARSnova Click.
 * Copyright (C) 2016 The ARSnova Team
 *
 * ARSnova Click is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Click is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.*/

import {MusicSessionConfiguration} from './session_config_music';
import {NickSessionConfiguration} from './session_config_nicks';
import {DefaultSettings} from '../../app/service/settings.service';
import {IMusicSessionConfiguration, INickSessionConfiguration, ISessionConfiguration} from './interfaces';

export abstract class AbstractSessionConfiguration implements ISessionConfiguration {
  get music(): IMusicSessionConfiguration {
    return this._music;
  }

  set music(value: IMusicSessionConfiguration) {
    this._music = value;
  }

  get nicks(): INickSessionConfiguration {
    return this._nicks;
  }

  set nicks(value: INickSessionConfiguration) {
    this._nicks = value;
  }

  get theme(): string {
    return this._theme;
  }

  set theme(value: string) {
    this._theme = value;
  }

  get readingConfirmationEnabled(): boolean {
    return this._readingConfirmationEnabled;
  }

  set readingConfirmationEnabled(value: boolean) {
    this._readingConfirmationEnabled = value;
  }

  get showResponseProgress(): boolean {
    return this._showResponseProgress;
  }

  set showResponseProgress(value: boolean) {
    this._showResponseProgress = value;
  }

  get confidenceSliderEnabled(): boolean {
    return this._confidenceSliderEnabled;
  }

  set confidenceSliderEnabled(value: boolean) {
    this._confidenceSliderEnabled = value;
  }

  private _music: IMusicSessionConfiguration;
  private _nicks: INickSessionConfiguration;
  private _theme: string;
  private _readingConfirmationEnabled: boolean;
  private _showResponseProgress: boolean;
  private _confidenceSliderEnabled: boolean;

  constructor({
    music = {},
    nicks = {},
    theme = DefaultSettings.defaultSettings.theme,
    readingConfirmationEnabled = DefaultSettings.defaultSettings.readingConfirmationEnabled,
    showResponseProgress = DefaultSettings.defaultSettings.showResponseProgress,
    confidenceSliderEnabled = DefaultSettings.defaultSettings.confidenceSliderEnabled
  }) {
    this.music = new MusicSessionConfiguration(music || {});
    this.nicks = new NickSessionConfiguration(nicks || {});
    this.theme = theme;
    this.readingConfirmationEnabled = readingConfirmationEnabled;
    this.showResponseProgress = showResponseProgress;
    this.confidenceSliderEnabled = confidenceSliderEnabled;
  }

  serialize(): any {
    return {
      music: this.music.serialize(),
      nicks: this.nicks.serialize(),
      theme: this.theme,
      readingConfirmationEnabled: this.readingConfirmationEnabled,
      showResponseProgress: this.showResponseProgress,
      confidenceSliderEnabled: this.confidenceSliderEnabled
    };
  }

  equals(value: ISessionConfiguration): boolean {
    return this.music.equals(value.music) &&
           this.nicks.equals(value.nicks) &&
           this.theme === value.theme &&
           this.readingConfirmationEnabled === value.readingConfirmationEnabled &&
           this.showResponseProgress === value.showResponseProgress &&
           this.confidenceSliderEnabled === value.confidenceSliderEnabled;
  }
}
