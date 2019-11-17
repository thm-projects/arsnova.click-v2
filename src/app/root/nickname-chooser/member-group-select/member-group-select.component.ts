import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-member-group-select',
  templateUrl: './member-group-select.component.html',
  styleUrls: ['./member-group-select.component.scss'],
})
export class MemberGroupSelectComponent {
  public static TYPE = 'MemberGroupSelectComponent';

  private _memberGroups: Array<string> = [];

  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private router: Router,
    private quizService: QuizService,
    private quizApiService: QuizApiService,
    private attendeeService: AttendeeService,
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
        this.quizApiService.getFreeMemberGroup().subscribe((data: IMessage) => {
          if (data.status === StatusProtocol.Success && data.step === MessageProtocol.GetFreeMemberGroup) {
            this.addToGroup(data.payload.groupName);
          }
        });
      } else {
        this._memberGroups = this.quizService.quiz.sessionConfig.nicks.memberGroups;
      }
    });
    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public addToGroup(groupName): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(StorageKey.CurrentMemberGroupName, groupName);
      this.router.navigate([
        '/nicks', (this.quizService.quiz.sessionConfig.nicks.selectedNicks.length ? 'select' : 'input'),
      ]);
    }
  }

}
