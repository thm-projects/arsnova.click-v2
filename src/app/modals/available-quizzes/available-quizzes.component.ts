import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalI} from '../modals.module';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {DefaultSettings} from '../../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {IMessage} from '../../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss']
})
export class AvailableQuizzesComponent implements OnInit, ModalI {
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
    private activeModal: NgbActiveModal,
    private http: HttpClient,
    private router: Router,
    private currentQuizService: CurrentQuizService,
    private activeQuestionGroupService: ActiveQuestionGroupService) {
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
    }).then(() => {
      this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby`, {
        quiz: session.serialize()
      }).subscribe(
        (data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL') {
            const questionGroup = new questionGroupReflection[data.payload.quiz.originalObject.TYPE](data.payload.quiz.originalObject);
            this.activeQuestionGroupService.activeQuestionGroup = questionGroup;
            this.currentQuizService.quiz = questionGroup;
            this.router.navigate([session.isValid() ? '/quiz/flow' : '/quiz/manager']);
          }
          this.next();
        }
      );
    }, (reason => {
      console.log(reason);
    }));
  }

  editQuiz(session: IQuestionGroup): void {
    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.router.navigate(['/quiz/manager']);
    this.next();
  }

  ngOnInit() {
  }

}
