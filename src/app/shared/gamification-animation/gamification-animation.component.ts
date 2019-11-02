import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-gamification-animation',
  templateUrl: './gamification-animation.component.html',
  styleUrls: ['./gamification-animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamificationAnimationComponent {
  public static TYPE = 'GamificationAnimationComponent';

  private _countdownValue: number;

  @Input() set countdownValue(value: number) {
    if (typeof value !== 'number' || value === -1) {
      return;
    }

    this._countdownValue = value;
    if (value < this._gamification.length) {
      this._background = this._gamification[value].background;
      if (this._gamification[value].image) {
        this._image = '/assets/images/gamification/' + this._gamification[value].image;
        this.cd.markForCheck();
      }
      if (!value) {
        setTimeout(() => {
          this._image = null;
          this.cd.markForCheck();
        }, 1000);
      }
    }
  }

  private _background: string;

  get background(): string {
    return this._background;
  }

  private _image = null;

  get image(): string {
    return this._image;
  }

  private _gamification = [
    {
      background: '#f4d717',
      image: 'finger_0.gif',
    }, {
      background: '#eca121',
      image: 'finger_1.gif',
    }, {
      background: '#cd2a2b',
      image: 'finger_2.gif',
    }, {
      background: '#c51884',
      image: 'finger_3.gif',
    }, {
      background: '#1c7bb5',
      image: 'finger_4.gif',
    }, {
      background: '#66bb5e',
      image: 'finger_5.gif',
    },
  ];

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
  }

  public sanitizeStyle(value: string): SafeStyle {
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }
}
