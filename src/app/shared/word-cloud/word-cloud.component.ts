import { ChangeDetectionStrategy, Component, Host, HostBinding, Input } from '@angular/core';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';

@Component({
  selector: 'app-word-cloud',
  template: `
    <angular-tag-cloud
      [data]="data"
      [width]="options.width"
      [height]="options.height"
      [overflow]="options.overflow"
      [realignOnResize]="options.realignOnResize">
    </angular-tag-cloud>
  `,
})
export class WordCloudComponent {

  public options: CloudOptions = {
    width: 1,
    height: 400,
    overflow: false,
    realignOnResize: true,
  };

  @Input() public data: Array<CloudData>;
}
