import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage, IPlayer} from '../../../quiz-flow/quiz-lobby/quiz-lobby.component';
import {FooterBarService} from '../../../service/footer-bar.service';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';

@Component({
  selector: 'app-nickname-select',
  templateUrl: './nickname-select.component.html',
  styleUrls: ['./nickname-select.component.scss']
})
export class NicknameSelectComponent implements OnInit {
  get nicks(): Array<string> {
    return this._nicks;
  }

  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}`;
  private _nicks: Array<string> = [];

  constructor(private http: HttpClient,
              private footerBarService: FooterBarService,
              private router: Router,
              private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
    ]);
  }

  joinQuiz(name: string): void {
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${this._httpApiEndpoint}/lobby/member/`, {
        quizName: this.currentQuiz.hashtag,
        nickname: name,
        webSocketId: window.sessionStorage.getItem('webSocket')
      })
      .subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          this.currentQuiz.currentQuestion = data.payload.currentQuestion;
          resolve();
        } else {
          reject();
        }
      });
    });
    promise.then(() => {
      this.router.navigate(['/quiz-lobby']);
    });
    promise.catch((err) => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.http.get(`${this._httpApiEndpoint}/quiz/member/${this.currentQuiz.hashtag}/available`).subscribe(
      (data: IMessage) => {
        console.log(data);
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:GET_REMAINING_NICKS') {
          this._nicks = this._nicks.concat(data.payload.nicknames);
        }
      }
    );
  }

}
