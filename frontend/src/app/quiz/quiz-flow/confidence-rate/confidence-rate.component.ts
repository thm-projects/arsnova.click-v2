import { Component, OnInit } from '@angular/core';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss']
})
export class ConfidenceRateComponent implements OnInit {
  get confidenceValue(): number {
    return this._confidenceValue;
  }

  private _confidenceValue = 100;

  constructor(
    private http: HttpClient,
    private currentQuizService: CurrentQuizService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  updateConficence(event: Event) {
    this._confidenceValue = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  sendConfidence() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby/member/confidence-value`, {
      quizName: this.currentQuizService.hashtag,
      nickname: window.sessionStorage.getItem(`${this.currentQuizService.hashtag}_nick`),
      confidenceValue: this._confidenceValue
    }).subscribe(
      (data: IMessage) => {
        this.router.navigate(['/quiz', 'flow', 'results']);
      }
    );
  }

}
