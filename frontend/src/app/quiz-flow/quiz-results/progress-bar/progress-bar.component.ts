import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IQuestion} from '../../../../lib/questions/interfaces';
import {AttendeeService} from '../../../service/attendee.service';
import {I18nService, NumberTypes} from '../../../service/i18n.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  @Input() data: IQuestion;
  @Input() questionIndex: number;

  constructor(private attendeeService: AttendeeService,
    private i18nService: I18nService) {
  }

  attendeeDataForAnswer(answerIndex: number): Object {
    const result = {
      answerIndex: answerIndex,
      label: this.data.answerOptionList[answerIndex].answerText,
      absolute: 0,
      base: this.attendeeService.attendees.length,
      percent: '0'
    };
    if (this.questionIndex >= 0) {
      const matches = this.attendeeService.attendees.filter(value => {
        if (typeof value.responses[this.questionIndex] === 'undefined') {
          return false;
        }
        const responseValue = value.responses[this.questionIndex].value;
        return responseValue === answerIndex ||
               (responseValue instanceof Array && (<Array<number>>responseValue).indexOf(answerIndex) > -1);
      });
      result.absolute = matches.length;
      result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberTypes.percent);
    }
    return result;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
