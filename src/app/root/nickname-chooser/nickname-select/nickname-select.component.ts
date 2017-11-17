import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../../lib/default.settings';
import {IMessage, INickname} from 'arsnova-click-v2-types/src/common';
import {FooterBarService} from '../../../service/footer-bar.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {AttendeeService} from '../../../service/attendee.service';
import {ConnectionService} from '../../../service/connection.service';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-nickname-select',
  templateUrl: './nickname-select.component.html',
  styleUrls: ['./nickname-select.component.scss']
})
export class NicknameSelectComponent implements OnInit, OnDestroy {
  get nicks(): Array<string> {
    return this._nicks;
  }

  private _nicks: Array<string> = [];

  constructor(
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private connectionService: ConnectionService,
    private currentQuiz: CurrentQuizService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  joinQuiz(name: string): void {
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${DefaultSettings.httpApiEndpoint}/member/`, {
        quizName: this.currentQuiz.quiz.hashtag,
        nickname: name,
        ticket: this.userService.ticket
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.nicknames.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          window.sessionStorage.setItem('config.websocket_authorization', data.payload.webSocketAuthorization);
          this.connectionService.authorizeWebSocket(this.currentQuiz.quiz.hashtag);
          resolve();
        } else {
          reject();
        }
      }, () => {
        reject();
      });
    });
    promise.then(() => {
      window.sessionStorage.setItem(`config.nick`, name);
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    }, (err) => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.http.get(`${DefaultSettings.httpApiEndpoint}/member/${this.currentQuiz.quiz.hashtag}/available`).subscribe(
      (data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:GET_REMAINING_NICKS') {
          this._nicks = this._nicks.concat(data.payload.nicknames);
        }
      }
    );
  }

  ngOnDestroy() {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
