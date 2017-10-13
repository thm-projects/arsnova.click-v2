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
    const matches = this.attendeeService.attendees.filter(value => {
      const responseValue = value.responses[this.questionIndex].value;
      return typeof value.responses[this.questionIndex] !== 'undefined' && (
        responseValue === answerIndex ||
        (responseValue instanceof Array && (<Array<number>>responseValue).indexOf(answerIndex) > -1)
      );
    });
    return {
      answerIndex: answerIndex,
      label: this.data.answerOptionList[answerIndex].answerText,
      absolute: matches.length,
      base: this.attendeeService.attendees.length,
      percent: matches.length / this.attendeeService.attendees.length * 100
    };
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
