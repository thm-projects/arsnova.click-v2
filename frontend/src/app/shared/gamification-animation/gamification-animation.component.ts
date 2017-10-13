import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
             selector: 'app-gamification-animation',
             templateUrl: './gamification-animation.component.html',
             styleUrls: ['./gamification-animation.component.scss']
           })
export class GamificationAnimationComponent implements OnInit {
  get image(): string {
    return this._image;
  }

  get background(): string {
    return this._background;
  }

  private _gamification = [
    {
      background: 'transparent',
      image: null
    },
    {
      background: '#f4d717',
      image: 'finger_0.gif'
    },
    {
      background: '#eca121',
      image: 'finger_1.gif'
    },
    {
      background: '#cd2a2b',
      image: 'finger_2.gif'
    },
    {
      background: '#c51884',
      image: 'finger_3.gif'
    },
    {
      background: '#1c7bb5',
      image: 'finger_4.gif'
    },
    {
      background: '#66bb5e',
      image: 'finger_5.gif'
    }
  ];

  @Input()
  set countdownValue(value: number) {
    this._countdownValue = value;
    if (value < this._gamification.length) {
      this._background = this._gamification[value].background;
      if (this._gamification[value].image) {
        this._image = '/assets/gamification/' + this._gamification[value].image;
      } else {
        this._image = null;
      }
    }
  }

  private _countdownValue: number;
  private _background: string;
  private _image = null;

  constructor(private sanitizer: DomSanitizer) {
  }

  sanitizeStyle(value: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  ngOnInit() {
  }

}
