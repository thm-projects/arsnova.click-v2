import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../service/settings.service';
import {IMessage, IPlayer} from '../../quiz-flow/quiz-lobby/quiz-lobby.component';

export declare interface ICurrentQuiz {
  hashtag: string;
}

@Component({
  selector: 'app-nickname-chooser',
  templateUrl: './nickname-chooser.component.html',
  styleUrls: ['./nickname-chooser.component.scss']
})
export class NicknameChooserComponent implements OnInit {
  get nicks(): Array<IPlayer> {
    return this._nicks;
  }

  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}`;
  private _quizData: ICurrentQuiz = JSON.parse(window.sessionStorage.getItem('currentQuiz') || '');
  private _nicks: Array<IPlayer> = [];

  constructor(private http: HttpClient) {
    if (!this._quizData) {
      throw new Error('Undefined quizdata in sessionStorage');
    }
  }

  ngOnInit() {
    this.http.get(`${this._httpApiEndpoint}/quiz/member/${this._quizData.hashtag}`).subscribe(
      (data: IMessage) => {
        console.log(data);
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:GET_AVAILABLE_NICKS') {
          this._nicks.push(data.payload.member);
        }
      }
    );
  }

}
