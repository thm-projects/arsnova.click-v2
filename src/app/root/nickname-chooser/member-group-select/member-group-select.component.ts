import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SimpleMQ } from 'ng2-simple-mq';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { IMemberGroupBase } from '../../../lib/interfaces/users/IMemberGroupBase';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-member-group-select',
  templateUrl: './member-group-select.component.html',
  styleUrls: ['./member-group-select.component.scss'],
})
export class MemberGroupSelectComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'MemberGroupSelectComponent';

  private _memberGroups: Array<IMemberGroupBase> = [];

  get memberGroups(): Array<IMemberGroupBase> {
    return this._memberGroups;
  }

  private _messageSubscriptions: Array<string> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private quizService: QuizService,
    private quizApiService: QuizApiService,
    private messageQueue: SimpleMQ,
    private sanitizer: DomSanitizer,
    private customMarkdownService: CustomMarkdownService,
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };

    this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.sessionConfig.nicks.autoJoinToGroup) {
        this.quizApiService.getFreeMemberGroup(this.quizService.quiz.name).subscribe((data: IMessage) => {
          if (data.status === StatusProtocol.Success && data.step === MessageProtocol.GetFreeMemberGroup) {
            this.addToGroup(data.payload.group);
          }
        });
      } else {
        this._memberGroups = this.quizService.quiz.sessionConfig.nicks.memberGroups;
      }
    });

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnInit(): void {
    this.handleMessages();
  }

  public addToGroup(groupName: IMemberGroupBase): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(StorageKey.CurrentMemberGroupName, groupName.name);
      this.router.navigate([
        '/nicks',
        (
          this.quizService.quiz.sessionConfig.nicks.selectedNicks.length ? 'select' : 'input'
        ),
      ]);
    }
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._messageSubscriptions.forEach(sub => this.messageQueue.unsubscribe(sub));
  }

  public sanitizeHTML(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseNickname(value: string): string {
    if (value.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(this.messageQueue.subscribe(MessageProtocol.Closed, () => {
      this.router.navigate(['/']);
    }));
  }

}
