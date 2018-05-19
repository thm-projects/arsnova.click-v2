import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FooterBarService} from '../../../service/footer-bar.service';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {DefaultSettings} from '../../../../lib/default.settings';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-member-group-select',
  templateUrl: './member-group-select.component.html',
  styleUrls: ['./member-group-select.component.scss']
})
export class MemberGroupSelectComponent implements OnInit {
  public static TYPE = 'MemberGroupSelectComponent';

  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  private _memberGroups: Array<string> = this.currentQuiz.quiz.sessionConfig.nicks.memberGroups;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private http: HttpClient,
    private currentQuiz: CurrentQuizService
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupSelectComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/']);
    };
  }

  ngOnInit() {

    if (this.currentQuiz.quiz.sessionConfig.nicks.autoJoinToGroup) {
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/${this.currentQuiz.quiz.hashtag}/freeGroup`)
        .subscribe((data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_UPDATED') {
            this.addToGroup(data.payload.groupName);
          }
        });
    }
  }

  public addToGroup(groupName) {
    if (isPlatformBrowser(this.platformId)) {
      const provideNickSelection: boolean = window.sessionStorage.getItem('temp.provideNickSelection') === 'true';
      window.sessionStorage.removeItem('temp.provideNickSelection');

      window.sessionStorage.setItem('config.memberGroup', groupName);
      this.router.navigate(['/nicks', (provideNickSelection ? 'select' : 'input')]);
    }
  }

}
