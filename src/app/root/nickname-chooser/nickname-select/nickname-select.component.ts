import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IMemberGroup, IMessage, INickname } from 'arsnova-click-v2-types/src/common';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../../service/storage/storage.service';
import { UserService } from '../../../service/user/user.service';
import { DB_TABLE, STORAGE_KEY } from '../../../shared/enums';

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
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private connectionService: ConnectionService,
    private currentQuizService: CurrentQuizService,
    private memberApiService: MemberApiService,
    private storageService: StorageService,
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  public joinQuiz(nickname: any): void {
    if (nickname.changingThisBreaksApplicationSecurity) {
      nickname = nickname.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    nickname = nickname.toString();
    const promise = new Promise(async (resolve, reject) => {
      this.memberApiService.putMember({
        quizName: this.currentQuizService.quiz.hashtag,
        nickname: nickname,
        groupName: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.MEMBER_GROUP).toPromise(),
        ticket: this.userService.casTicket,
      }).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.memberGroups.forEach((memberGroup: IMemberGroup) => {
            memberGroup.members.forEach((nicksInMemberGroup: INickname) => {
              this.attendeeService.addMember(nicksInMemberGroup);
            });
          });
          this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.WEBSOCKET_AUTHORIZATION, data.payload.webSocketAuthorization).subscribe();
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
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.NICK, nickname).subscribe();
      this.attendeeService.ownNick = nickname;
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
    }
    this._isLoading = true;
    this.memberApiService.getAvailableMemberNames(this.currentQuizService.quiz.hashtag).subscribe(data => {
      this._isLoading = false;
      if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:GET_REMAINING_NICKS') {
        this._nicks = this._nicks.concat(data.payload.nicknames);
      }
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
