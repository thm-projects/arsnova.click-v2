import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FooterBarService} from '../../../service/footer-bar.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {IMessage} from '../../../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {DefaultSettings} from '../../../service/settings.service';
import {AttendeeService} from '../../../service/attendee.service';
import {ConnectionService} from '../../../service/connection.service';

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

  constructor(
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
  }

  joinQuiz(): void {
    const nickname = (<HTMLInputElement>document.getElementById('input-nickname')).value;
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${this._httpApiEndpoint}/lobby/member/`, {
        quizName: this.currentQuiz.hashtag,
        nickname: nickname
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          this.currentQuiz.sessionConfiguration = data.payload.sessionConfiguration;
          this.attendeeService.attendees = data.payload.nicknames;
          window.sessionStorage.setItem('webSocketAuthorization', data.payload.webSocketAuthorization);
          this.connectionService.authorizeWebSocket(this.currentQuiz.hashtag);
          resolve();
        } else {
          reject(data);
        }
      }, () => {
        reject();
      });
    });
    promise.then(() => {
      window.sessionStorage.setItem(`${this.currentQuiz.hashtag}_nick`, nickname);
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    }, (data: IMessage) => {
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
