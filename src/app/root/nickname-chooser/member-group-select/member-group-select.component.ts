import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-member-group-select',
  templateUrl: './member-group-select.component.html',
  styleUrls: ['./member-group-select.component.scss'],
})
export class MemberGroupSelectComponent implements OnInit {
  public static TYPE = 'MemberGroupSelectComponent';

  private _memberGroups: Array<string> = this.currentQuizService.quiz.sessionConfig.nicks.memberGroups;

  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private currentQuizService: CurrentQuizService,
    private quizApiService: QuizApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  public ngOnInit(): void {

    if (this.currentQuizService.quiz.sessionConfig.nicks.autoJoinToGroup) {
      this.quizApiService.getFreeMemberGroup(this.currentQuizService.quiz.hashtag).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_UPDATED') {
          this.addToGroup(data.payload.groupName);
        }
      });
    }
  }

  public addToGroup(groupName): void {
    if (isPlatformBrowser(this.platformId)) {
      const provideNickSelection: boolean = window.sessionStorage.getItem('temp.provideNickSelection') === 'true';
      window.sessionStorage.removeItem('temp.provideNickSelection');

      window.sessionStorage.setItem('config.memberGroup', groupName);
      this.router.navigate(['/nicks', (provideNickSelection ? 'select' : 'input')]);
    }
  }

}
