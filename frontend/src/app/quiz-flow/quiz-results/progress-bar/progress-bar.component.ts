import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IQuestion} from '../../../../lib/questions/interfaces';
import {AttendeeService} from '../../../service/attendee.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  @Input() data: IQuestion;
  @Input() questionIndex: number;

  constructor(private attendeeService: AttendeeService) {
  }

  attendeeDataForAnswer(answerIndex: number): Object {
    const result = {
      answerIndex: answerIndex,
      label: this.data.answerOptionList[answerIndex].answerText,
      absolute: 0,
      base: this.attendeeService.attendees.length,
      percent: 0
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
      result.percent = matches.length / this.attendeeService.attendees.length * 100;
    }
    return result;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
