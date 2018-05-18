import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../../lib/default.settings';
import {IMemberGroup, IMessage, INickname} from 'arsnova-click-v2-types/src/common';
import {FooterBarService} from '../../../service/footer-bar.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {AttendeeService} from '../../../service/attendee.service';
import {ConnectionService} from '../../../service/connection.service';
import {UserService} from '../../../service/user.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';

@Component({
  selector: 'app-nickname-select',
  templateUrl: './nickname-select.component.html',
  styleUrls: ['./nickname-select.component.scss']
})
export class NicknameSelectComponent implements OnInit, OnDestroy {
  get isLoading(): boolean {
    return this._isLoading;
  }
  public static TYPE = 'NicknameSelectComponent';

  get nicks(): Array<string> {
    return this._nicks;
  }

  private _nicks: Array<string> = [];
  private _isLoading: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private connectionService: ConnectionService,
    private currentQuiz: CurrentQuizService
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  joinQuiz(name: any): void {
    if (name.changingThisBreaksApplicationSecurity) {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    name = name.toString();
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${DefaultSettings.httpApiEndpoint}/member/`, {
        quizName: this.currentQuiz.quiz.hashtag,
        nickname: name,
        groupName: window.sessionStorage.getItem('config.memberGroup'),
        ticket: this.userService.ticket
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.memberGroups.forEach((memberGroup: IMemberGroup) => {
            memberGroup.members.forEach((nickname: INickname) => {
              this.attendeeService.addMember(nickname);
            });
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

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  parseAvailableNick(name: string): SafeHtml {
    return name.match(/:[\w\+\-]+:/g) ? this.sanitizeHTML(parseGithubFlavoredMarkdown(name)) : name;
  }

  ngOnInit() {
    if (this.attendeeService.getOwnNick()) {
      this.router.navigate(['/']);
      return;
    }
    this._isLoading = true;
    this.http.get(`${DefaultSettings.httpApiEndpoint}/member/${this.currentQuiz.quiz.hashtag}/available`).subscribe(
      (data: IMessage) => {
        this._isLoading = false;
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
