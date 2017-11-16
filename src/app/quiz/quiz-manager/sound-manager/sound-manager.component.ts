import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from 'app/service/footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {IMusicSessionConfiguration} from 'arsnova-click-v2-types/src/session_configuration/interfaces';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {DefaultSettings} from '../../../../lib/default.settings';

export declare interface ISong {
  id: string;
  text: string;
}

@Component({
  selector: 'app-sound-manager',
  templateUrl: './sound-manager.component.html',
  styleUrls: ['./sound-manager.component.scss']
})
export class SoundManagerComponent implements OnInit, OnDestroy {
  get countdownEndSounds(): Array<ISong> {
    return this._countdownEndSounds;
  }

  get countdownRunningSounds(): Array<ISong> {
    return this._countdownRunningSounds;
  }

  get lobbySongs(): Array<ISong> {
    return this._lobbySongs;
  }

  get config(): IMusicSessionConfiguration {
    return this._config;
  }

  private _config: IMusicSessionConfiguration;
  private _lobbySongs: Array<ISong> = [];
  private _countdownRunningSounds: Array<ISong> = [];
  private _countdownEndSounds: Array<ISong> = [];

  private _currentlyPlayedMusic = null;

  constructor(
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private activeQuestionGroupService: ActiveQuestionGroupService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.translateService.get('plugins.sound.random').subscribe(value => {
      this._lobbySongs.push({id: 'Random', text: value});
      this._countdownRunningSounds.push({id: 'Random', text: value});
      this._countdownEndSounds.push({id: 'Random', text: value});
    });
    this.translateService.get('plugins.sound.whistle').subscribe(value => {
      this._countdownEndSounds.push({id: 'Song0', text: value});
    });
    this._config = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.music;

    this._lobbySongs.push({id: 'Song0', text: 'Happy & fun mood: "Clear day" | Bensound.com'});
    this._lobbySongs.push({id: 'Song1', text: 'House music: "House" | Bensound.com'});
    this._lobbySongs.push({id: 'Song2', text: 'Gypsy french jazz: "Jazzy frenchy" | Bensound.com'});
    this._lobbySongs.push({id: 'Song3', text: 'Childish: "Little idea" | Bensound.com'});

    this._countdownRunningSounds.push({id: 'Song0', text: 'Relax mood: "The Lounge" | Bensound.com'});
    this._countdownRunningSounds.push({id: 'Song1', text: 'Ukulele: "Cute" | Bensound.com'});
    this._countdownRunningSounds.push({id: 'Song2', text: 'Driving tune: "Epic" | Bensound.com'});

    this._countdownEndSounds.push({id: 'Song1', text: 'Chinese Gong'});

    this.config.titleConfig.lobby = this.config.titleConfig.lobby || 'Song0';
    this.config.titleConfig.countdownRunning = this.config.titleConfig.countdownRunning || 'Song0';
    this.config.titleConfig.countdownEnd = this.config.titleConfig.countdownEnd || 'Song0';
  }

  selectSound(target: 'lobby' | 'countdownRunning' | 'countdownEnd', event: Event): void {
    this.config.titleConfig[target] = (<HTMLSelectElement>event.target).value;
    this.toggleMusicPreview(target);
  }

  toggleMusicPreview(target: 'lobby' | 'countdownRunning' | 'countdownEnd') {
    this._currentlyPlayedMusic = `${DefaultSettings.httpApiEndpoint}/files/sound/${target}/${this.config.titleConfig[target]}.mp3`;
    const audioElements = document.getElementsByTagName('audio');
    for (let i = 0; i < audioElements.length; i++) {
      (<HTMLAudioElement>audioElements.item(i)).volume = (this.config.volumeConfig[target] || 60) / 100;
    }
  }

  setGlobalVolume($event) {
    this.config.volumeConfig.global = parseInt((<HTMLInputElement>$event.target).value, 10);
  }

  openTab(id: string): void {
    // TODO: Workaround because Bootstrap v4 Beta carousel not working! (02.10.2017)
    const tabs = document.getElementsByClassName('collapse');
    for (let i = 0; i < tabs.length; i++) {
      tabs.item(i).classList.remove('show');
    }
    document.getElementById(id).classList.add('show');
    this.toggleMusicPreview(<'lobby' | 'countdownRunning' | 'countdownEnd'>id.replace('panel-', ''));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.music = this._config;
    this.activeQuestionGroupService.persistForSession();
  }

}
