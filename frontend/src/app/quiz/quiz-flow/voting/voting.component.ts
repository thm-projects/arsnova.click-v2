import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {Countdown} from '../quiz-results/quiz-results.component';
import {Router} from '@angular/router';
import {AttendeeService} from '../../../service/attendee.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit, OnDestroy {
  get countdownValue(): number {
    return this._countdownValue;
  }

  private _countdown: Countdown;
  private _countdownValue: number;
  private _startResponseTime = new Date().getTime();

  constructor(public currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private attendeeService: AttendeeService,
    private router: Router) {
  }

  ngOnInit() {
    this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/startTime/${this.currentQuizService.hashtag}`)
        .subscribe((data: IMessage) => {
      if (data.status === 'STATUS:SUCCESSFUL') {
        this._countdown = new Countdown(this.currentQuizService.currentQuestion, data.payload.startTimestamp);
        this._countdown.onChange.subscribe((value) => {
          this._countdownValue = value;
          if (!value) {
            this.router.navigate(['/quiz', 'flow', 'results']);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    const values: Array<string> = [];
    const elements = document.getElementsByClassName('selected');
    for (let i = 0; i < elements.length; i++) {
      values.push(elements.item(i).id);
    }
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this.currentQuizService.hashtag,
      nickname: this.attendeeService.getOwnNick(),
      value: values,
      responseTime: (new Date().getTime() - this._startResponseTime) / 1000
    }).subscribe(
      (data: IMessage) => {
        if (data.status !== 'STATUS:SUCCESSFUL') {
          console.log(data);
        }
      }
    );
  }

}
