import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleMQ } from 'ng2-simple-mq';
import { BonusTokenService } from 'src/app/service/user/bonus-token/bonus-token.service';
import { MemberEntity } from '../../../lib/entities/member/MemberEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-nickname-input',
  templateUrl: './nickname-input.component.html',
  styleUrls: ['./nickname-input.component.scss'],
})
export class NicknameInputComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'NicknameInputComponent';

  private _failedLoginReason = '';
  private _messageSubscriptions: Array<string> = [];

  public isLoggingIn: boolean;
  public nickname: string;

  get failedLoginReason(): string {
    return this._failedLoginReason;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private quizService: QuizService,
    private memberApiService: MemberApiService,
    private messageQueue: SimpleMQ,
    private bonusTokenService: BonusTokenService
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameInputComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  public async joinQuiz(): Promise<void> {
    if (isPlatformServer(this.platformId) || !this.nickname) {
      return;
    }

    this.isLoggingIn = true;

    const token = await this.memberApiService.generateMemberToken(this.nickname, this.quizService.quiz.name).toPromise();

    sessionStorage.setItem(StorageKey.QuizToken, token);

    this.putMember(this.nickname).then(() => {
      this.attendeeService.ownNick = this.nickname;
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    }, data => {
      this.isLoggingIn = false;

      if (!data) {
        this.router.navigate(['/']);
        return;
      }

      switch (data.step) {
        case MessageProtocol.DuplicateLogin:
          this._failedLoginReason = 'plugins.splashscreen.error.error_messages.duplicate_user';
          break;
        case MessageProtocol.IllegalName:
          this._failedLoginReason = 'component.choose_nickname.nickname_blacklist_popup';
          break;
        default:
          this._failedLoginReason = 'plugins.splashscreen.error.error_messages.invalid_input_data';
      }
    });
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.attendeeService.ownNick) {
      this.router.navigate(['/']);
    }

    this.handleMessages();

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._messageSubscriptions.forEach(sub => this.messageQueue.unsubscribe(sub));
  }

  private putMember(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
        resolve();
      }));

      this.memberApiService.putMember(new MemberEntity({
        currentQuizName: this.quizService.quiz.name,
        name,
        groupName: sessionStorage.getItem(StorageKey.CurrentMemberGroupName),
        ticket: this.userService.casTicket,
      })).subscribe(data => {
        if (data.status !== StatusProtocol.Success || data.step !== MessageProtocol.Added) {
          reject(data);
        } else {
          this.bonusTokenService.getBonusToken().subscribe(
              nextResult => {
                this.attendeeService.bonusToken = nextResult;
              },
              err => console.error('Observer got an error: ' + err)
          );
        }
      }, (error) => {
        reject({
          status: StatusProtocol.Failed,
          payload: error,
        });
      });
    });
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.Closed, () => {
      this.router.navigate(['/']);
    }));
  }

}
