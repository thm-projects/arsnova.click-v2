import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MemberEntity } from '../../../../lib/entities/member/MemberEntity';
import { MessageProtocol, StatusProtocol } from '../../../../lib/enums/Message';
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
    private userService: UserService,
    private quizService: QuizService,
    private memberApiService: MemberApiService,
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
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const nickname = (<HTMLInputElement>document.getElementById('input-nickname')).value;

    const token = await this.memberApiService.generateMemberToken(nickname, this.quizService.quiz.name).toPromise();

    sessionStorage.setItem('token', token);

    this.putMember(nickname, sessionStorage.getItem('memberGroup')).then(() => {
      this.attendeeService.ownNick = nickname;
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    }, data => {
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
    if (this.attendeeService.ownNick) {
      this.router.navigate(['/']);
    }
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

  private putMember(name, groupName): Promise<void> {
    return new Promise((resolve, reject) => {
      this.memberApiService.putMember(new MemberEntity({
        currentQuizName: this.quizService.quiz.name,
        name,
        groupName,
        ticket: this.userService.casTicket,
      })).subscribe(data => {
        if (data.status === StatusProtocol.Success && data.step === MessageProtocol.Added) {
          resolve();
        } else {
          reject(data);
        }
      }, (error) => {
        reject({
          status: StatusProtocol.Failed,
          payload: error,
        });
      });
    });
  }

}
