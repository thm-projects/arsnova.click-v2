import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceTypes, EnvironmentTypes} from '../live-preview.module';
import {QuestionTextService} from '../../service/question-text.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss']
})
export class LivePreviewComponent implements OnInit, OnDestroy {

  @Input() private targetDevice: DeviceTypes;
  @Input() private targetEnvironment: EnvironmentTypes;
  private dataSource: string;

  private _subscription: Subscription;

  constructor(private questionTextService: QuestionTextService) {
  }

  public deviceClass() {
    switch (this.targetDevice) {
      case 0:
        return 'device_xs';
      case 1:
        return 'device_sm';
      case 2:
        return 'device_md';
      case 3:
        return 'device_lg';
      case 4:
        return 'device_xlg';
    }
  }

  ngOnInit() {
    this.dataSource = this.questionTextService.currentValue.join('<br/>');
    this._subscription = this.questionTextService.getEmitter().subscribe(value => this.dataSource = value.join('<br/>'));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
