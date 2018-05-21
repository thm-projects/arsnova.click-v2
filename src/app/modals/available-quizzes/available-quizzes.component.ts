import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { IModal } from 'arsnova-click-v2-types/src/modals/interfaces';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { DefaultSettings } from '../../../lib/default.settings';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss'],
})
export class AvailableQuizzesComponent implements OnInit, IModal {
  public static TYPE = 'AvailableQuizzesComponent';

  private _sessions: Array<IQuestionGroup> = [];

  get sessions(): Array<IQuestionGroup> {
    return this._sessions;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activeModal: NgbActiveModal,
    private http: HttpClient,
    private router: Router,
    private currentQuizService: CurrentQuizService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
  ) {
    const sessions = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
    sessions.sort((a, b) => a > b);
    const self = this;
    sessions.forEach((elem) => {
      elem = JSON.parse(window.localStorage.getItem(elem));
      self.sessions.push(questionGroupReflection[elem.TYPE](elem));
    });
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public abort(): void {
    this.activeModal.close();
  }

  public next(): void {
    this.activeModal.close();
  }

  public async startQuiz(session: IQuestionGroup): Promise<any> {
    return new Promise(async resolve => {
      this.trackingService.trackClickEvent({ action: AvailableQuizzesComponent.TYPE, label: 'start-quiz' });

      const quizStatusData = await this.http.get<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/status/${session.hashtag}`).toPromise();
      if (quizStatusData.status !== 'STATUS:SUCCESSFUL') {
        resolve();
        return;
      }
      if (quizStatusData.step === 'QUIZ:UNDEFINED') {
        await this.http.post<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/reserve/override`, {
          quizName: session.hashtag,
          privateKey: window.localStorage.getItem('config.private_key'),
        }).toPromise();
      }

      if (!session.isValid()) {
        this.activeQuestionGroupService.activeQuestionGroup = session;
        this.router.navigate(['/quiz', 'manager']);
        resolve();
        return;
      }

      this.currentQuizService.quiz = session;
      await this.currentQuizService.cacheQuiz();

      const openQuizRequestData = await this.http.put<IMessage>(`${DefaultSettings.httpApiEndpoint}/lobby`, {
        quiz: this.currentQuizService.quiz.serialize(),
      }).toPromise();

      if (openQuizRequestData.status === 'STATUS:SUCCESSFUL') {
        this.router.navigate(['/quiz', 'flow']);
      }

      this.next();

      resolve();
    });
  }

  public editQuiz(session: IQuestionGroup): void {
    this.trackingService.trackClickEvent({ action: AvailableQuizzesComponent.TYPE, label: 'edit-quiz' });

    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.router.navigate(['/quiz', 'manager']);
    this.next();
  }

  public ngOnInit(): void {
  }

}
