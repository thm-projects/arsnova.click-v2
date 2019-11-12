import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SimpleMQ } from 'ng2-simple-mq';
import { MemberEntity } from '../../../lib/entities/member/MemberEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-nickname-select',
  templateUrl: './nickname-select.component.html',
  styleUrls: ['./nickname-select.component.scss'],
})
export class NicknameSelectComponent implements OnInit, OnDestroy {
  public static TYPE = 'NicknameSelectComponent';
  public isLoggingIn: string;

  private _nicks: Array<string> = [];

  get nicks(): Array<string> {
    return this._nicks;
  }

  private _messageSubscriptions: Array<string> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService,
    private router: Router,
    private attendeeService: AttendeeService,
    private userService: UserService,
    private quizService: QuizService,
    private memberApiService: MemberApiService,
    private messageQueue: SimpleMQ,
    private customMarkdownService: CustomMarkdownService,
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
    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = nickname;
    if (nickname.changingThisBreaksApplicationSecurity) {
      nickname = nickname.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    nickname = nickname.toString();

    const token = await this.memberApiService.generateMemberToken(nickname, this.quizService.quiz.name).toPromise();

    sessionStorage.setItem(StorageKey.QuizToken, token);

    const promise = new Promise(async (resolve, reject) => {
      this.memberApiService.putMember(new MemberEntity({
        currentQuizName: this.quizService.quiz.name,
        name: nickname,
        groupName: sessionStorage.getItem(StorageKey.CurrentMemberGroupName),
        ticket: this.userService.casTicket,
      })).subscribe((data: IMessage) => {
        if (data.status === StatusProtocol.Success && data.step === MessageProtocol.Added) {
          this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.Added, payload => {
            this.attendeeService.addMember(payload.member);
            resolve();
          }));
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
      console.log('NicknameSelectComponent: PutMember failed', err);
      this.router.navigate(['/']);
      this.isLoggingIn = null;
    });
  }

  public sanitizeHTML(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseAvailableNick(name: string): string {
    return name.match(/:[\w\+\-]+:/g) ? this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(name)) : name;
  }

  public ngOnInit(): void {
    if (this.attendeeService.ownNick) {
      this.router.navigate(['/']);
    }

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.memberApiService.getAvailableNames(this.quizService.quiz.name).subscribe(data => {
        this._nicks = this._nicks.concat(data);
      });
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._messageSubscriptions.forEach(sub => this.messageQueue.unsubscribe(sub));
  }
}
