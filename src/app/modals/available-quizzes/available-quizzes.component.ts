import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {IModal} from 'arsnova-click-v2-types/src/modals/interfaces';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {DefaultSettings} from '../../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {Router} from '@angular/router';
import {TrackingService} from '../../service/tracking.service';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss']
})
export class AvailableQuizzesComponent implements OnInit, IModal {
  public static TYPE = 'AvailableQuizzesComponent';

  private _sessions: Array<IQuestionGroup> = [];

  dismiss(result?: any): void {
    this.activeModal.dismiss(result);
  }

  abort(result?: any): void {
    this.activeModal.close(result);
  }

  next(result?: any): void {
    this.activeModal.close(result);
  }

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
    private trackingService: TrackingService
  ) {
    const sessions = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
    sessions.sort(function (a, b) {
      return a > b;
    });
    const self = this;
    sessions.forEach(function (elem) {
      elem = JSON.parse(window.localStorage.getItem(elem));
      self._sessions.push(questionGroupReflection[elem.TYPE](elem));
    });
  }

  startQuiz(session: IQuestionGroup): void {
    this.trackingService.trackClickEvent({action: AvailableQuizzesComponent.TYPE, label: 'start-quiz'});

    new Promise((resolve, reject) => {
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/status/${session.hashtag}`).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL') {
          if (data.step === 'QUIZ:UNDEFINED') {
            this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/reserve/override`, {
              quizName: session.hashtag,
              privateKey: window.localStorage.getItem('config.private_key')
            }).subscribe((reserveResponse: IMessage) => {
              if (reserveResponse.status === 'STATUS:SUCCESSFUL') {
                resolve();
              } else {
                reject([data, reserveResponse]);
              }
            });
          } else {
            resolve();
          }
        } else {
          reject(data);
        }
      });
    }).then(async () => {
      if (!session.isValid()) {
        this.activeQuestionGroupService.activeQuestionGroup = session;
        this.router.navigate(['/quiz', 'manager']);
        return;
      }
      this.currentQuizService.quiz = session;
      await this.currentQuizService.cacheQuiz(session);
      await this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby`, {
        quiz: this.currentQuizService.quiz.serialize()
      }).subscribe(
        (data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL') {
            this.router.navigate(['/quiz', 'flow']);
          }
          this.next();
        }
      );
    }, (reason => {
      console.log(reason);
    }));
  }

  editQuiz(session: IQuestionGroup): void {
    this.trackingService.trackClickEvent({action: AvailableQuizzesComponent.TYPE, label: 'edit-quiz'});

    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.router.navigate(['/quiz', 'manager']);
    this.next();
  }

  ngOnInit() {
  }

}
