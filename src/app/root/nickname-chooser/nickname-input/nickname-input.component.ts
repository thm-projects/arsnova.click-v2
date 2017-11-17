import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FooterBarService} from '../../../service/footer-bar.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {IMessage, INickname} from 'arsnova-click-v2-types/src/common';
import {DefaultSettings} from '../../../../lib/default.settings';
import {AttendeeService} from '../../../service/attendee.service';
import {ConnectionService} from '../../../service/connection.service';

@Component({
  selector: 'app-nickname-input',
  templateUrl: './nickname-input.component.html',
  styleUrls: ['./nickname-input.component.scss']
})
export class NicknameInputComponent implements OnInit, OnDestroy {
  get failedLoginReason(): string {
    return this._failedLoginReason;
  }

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
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  joinQuiz(): void {
    const nickname = (<HTMLInputElement>document.getElementById('input-nickname')).value;
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${DefaultSettings.httpApiEndpoint}/member/`, {
        quizName: this.currentQuiz.quiz.hashtag,
        nickname: nickname
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.nicknames.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          window.sessionStorage.setItem('config.websocket_authorization', data.payload.webSocketAuthorization);
          this.connectionService.authorizeWebSocket(this.currentQuiz.quiz.hashtag);
          resolve();
        } else {
          reject(data);
        }
      }, () => {
        reject();
      });
    });
    promise.then(() => {
      window.sessionStorage.setItem(`config.nick`, nickname);
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

  ngOnDestroy() {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
