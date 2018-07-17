import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMemberGroup } from 'arsnova-click-v2-types/src/common';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../../service/storage/storage.service';
import { UserService } from '../../../service/user/user.service';
import { DB_TABLE, STORAGE_KEY } from '../../../shared/enums';

@Component({
  selector: 'app-nickname-input',
  templateUrl: './nickname-input.component.html',
  styleUrls: ['./nickname-input.component.scss'],
})
export class NicknameInputComponent implements OnInit, OnDestroy {
  public static TYPE = 'NicknameInputComponent';

  private _failedLoginReason = '';

  get failedLoginReason(): string {
    return this._failedLoginReason;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private userService: UserService,
    private currentQuizService: CurrentQuizService,
    private memberApiService: MemberApiService,
    private storageService: StorageService,
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameInputComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  public joinQuiz(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const nickname = (
      <HTMLInputElement>document.getElementById('input-nickname')
    ).value;
    const promise = new Promise(async (resolve, reject) => {
      this.memberApiService.putMember({
        quizName: this.currentQuizService.quiz.hashtag,
        nickname: nickname,
        groupName: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.MEMBER_GROUP).toPromise(),
        ticket: this.userService.casTicket,
      }).subscribe(data => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          data.payload.memberGroups.forEach((memberGroup: IMemberGroup) => {
            memberGroup.members.forEach(attendee => this.attendeeService.addMember(attendee));
          });
          this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.WEBSOCKET_AUTHORIZATION, data.payload.webSocketAuthorization).subscribe();
          this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
          resolve();
        } else {
          reject(data);
        }
      }, (error) => {
        reject({
          step: 'HTTP_ERROR',
          payload: error,
        });
      });
    });
    promise.then(() => {
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.NICK, nickname).subscribe();
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    }, data => {
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

  public ngOnInit(): void {
    this.attendeeService.getOwnNick().then(nick => {
      if (nick) {
        this.router.navigate(['/']);
      }
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
