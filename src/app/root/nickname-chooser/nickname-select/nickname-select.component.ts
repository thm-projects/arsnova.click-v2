import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IMemberGroup, IMessage, INickname } from 'arsnova-click-v2-types/src/common';
import { DefaultSettings } from '../../../../lib/default.settings';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-nickname-select',
  templateUrl: './nickname-select.component.html',
  styleUrls: ['./nickname-select.component.scss'],
})
export class NicknameSelectComponent implements OnInit, OnDestroy {
  public static TYPE = 'NicknameSelectComponent';

  private _nicks: Array<string> = [];

  get nicks(): Array<string> {
    return this._nicks;
  }

  private _isLoading: boolean;

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private connectionService: ConnectionService,
    private currentQuizService: CurrentQuizService,
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  public joinQuiz(name: any): void {
    if (name.changingThisBreaksApplicationSecurity) {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    name = name.toString();
    const promise = new Promise((resolve, reject) => {
      this.http.put(`${DefaultSettings.httpApiEndpoint}/member/`, {
        quizName: this.currentQuizService.quiz.hashtag,
        nickname: name,
        groupName: window.sessionStorage.getItem('config.memberGroup'),
        ticket: this.userService.ticket,
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.memberGroups.forEach((memberGroup: IMemberGroup) => {
            memberGroup.members.forEach((nickname: INickname) => {
              this.attendeeService.addMember(nickname);
            });
          });
          window.sessionStorage.setItem('config.websocket_authorization', data.payload.webSocketAuthorization);
          this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
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

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public parseAvailableNick(name: string): SafeHtml {
    return name.match(/:[\w\+\-]+:/g) ? this.sanitizeHTML(parseGithubFlavoredMarkdown(name)) : name;
  }

  public ngOnInit(): void {
    if (this.attendeeService.getOwnNick()) {
      this.router.navigate(['/']);
      return;
    }
    this._isLoading = true;
    this.http.get(`${DefaultSettings.httpApiEndpoint}/member/${this.currentQuizService.quiz.hashtag}/available`).subscribe(
      (data: IMessage) => {
        this._isLoading = false;
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:GET_REMAINING_NICKS') {
          this._nicks = this._nicks.concat(data.payload.nicknames);
        }
      },
    );
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
