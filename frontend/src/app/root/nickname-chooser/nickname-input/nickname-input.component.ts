import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FooterBarService} from '../../../service/footer-bar.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {IMessage} from '../../../quiz-flow/quiz-lobby/quiz-lobby.component';
import {DefaultSettings} from '../../../service/settings.service';

@Component({
  selector: 'app-nickname-input',
  templateUrl: './nickname-input.component.html',
  styleUrls: ['./nickname-input.component.scss']
})
export class NicknameInputComponent implements OnInit {
  get failedLoginReason(): string {
    return this._failedLoginReason;
  }

  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}`;
  private _failedLoginReason = '';

  constructor(private http: HttpClient,
               private footerBarService: FooterBarService,
               private router: Router,
               private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
    ]);
  }

  joinQuiz(): void {
    const nickname = (<HTMLInputElement>document.getElementById('input-nickname')).value;
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${this._httpApiEndpoint}/lobby/member/`, {
        quizName: this.currentQuiz.hashtag,
        nickname: nickname,
        webSocketId: window.sessionStorage.getItem('webSocket')
      }).subscribe((data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
            this.currentQuiz.currentQuestion = data.payload.currentQuestion;
            resolve();
          } else {
            reject(data);
          }
        });
    });
    promise.then(() => {
      window.sessionStorage.setItem(`${this.currentQuiz.hashtag}_nick`, nickname);
      this.router.navigate(['/quiz-lobby']);
    });
    promise.catch((data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:DUPLICATE_LOGIN':
          this._failedLoginReason = 'plugins.splashscreen.error.error_messages.duplicate_user';
          break;
        case 'LOBBY:ILLEGAL_NAME':
          this._failedLoginReason = 'component.choose_nickname.nickname_blacklist_popup';
          break;
        default:
          this._failedLoginReason = 'plugins.splashscreen.error.error_messages.invalid_input_data';
      }
    });
  }

  ngOnInit() {
  }

}
