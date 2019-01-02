import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MemberEntity } from '../../../../lib/entities/member/MemberEntity';
import { MessageProtocol, StatusProtocol } from '../../../../lib/enums/Message';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { IMemberGroupSerialized } from '../../../../lib/interfaces/users/IMemberGroupSerialized';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { StorageService } from '../../../service/storage/storage.service';
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
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private connectionService: ConnectionService,
    private quizService: QuizService,
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

  public async joinQuiz(nickname: any): Promise<void> {
    if (nickname.changingThisBreaksApplicationSecurity) {
      nickname = nickname.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    nickname = nickname.toString();

    const token = await this.memberApiService.generateMemberToken(nickname, this.quizService.quiz.name).toPromise();

    sessionStorage.setItem('token', token);

    const promise = new Promise(async (resolve, reject) => {
      this.memberApiService.putMember(new MemberEntity({
        currentQuizName: this.quizService.quiz.name,
        name: nickname,
        groupName: sessionStorage.getItem('memberGroup'),
        ticket: this.userService.casTicket,
      })).subscribe((data: IMessage) => {
        if (data.status === StatusProtocol.Success && data.step === MessageProtocol.Added) {
          data.payload.memberGroups.forEach((group: IMemberGroupSerialized) => {
            group.members.forEach((nicksInMemberGroup: IMemberSerialized) => {
              this.attendeeService.addMember(nicksInMemberGroup);
            });
          });
          this.connectionService.connectToChannel(this.quizService.quiz.name);
          resolve();
        } else {
          reject();
        }
      }, () => {
        reject();
      });
    });
    promise.then(() => {
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
    if (this.attendeeService.ownNick) {
      this.router.navigate(['/']);
    }
    this._isLoading = true;
    this.memberApiService.getAvailableNames(this.quizService.quiz.name).subscribe(data => {
      this._isLoading = false;
      this._nicks = this._nicks.concat(data);
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
