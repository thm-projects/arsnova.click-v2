import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../lib/default.settings';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {CasService} from '../../service/cas.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {ThemesService} from '../../service/themes.service';

@Component({
  selector: 'app-quiz-join',
  templateUrl: './quiz-join.component.html',
  styleUrls: ['./quiz-join.component.scss']
})
export class QuizJoinComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizJoinComponent';

  private _routerSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasService,
    public currentQuizService: CurrentQuizService,
    private themesService: ThemesService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      const ticket = queryParams.ticket;
      if (ticket) {
        this.casService.ticket = ticket;
      }
      this.route.params.subscribe(params => {
        const quizname = params.quizName;
        this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/status/${quizname}`).subscribe((value: IMessage) => {
          if (value.status === 'STATUS:SUCCESSFUL' && value.step === 'QUIZ:AVAILABLE') {
            this.casService.casLoginRequired = value.payload.authorizeViaCas;
            if (this.casService.casLoginRequired) {
              this.casService.quizName = quizname;
            }
            this.http.get(`${DefaultSettings.httpApiEndpoint}/lobby/${quizname}`).subscribe(
              (data: IMessage) => {
                const quiz = data.payload.quiz.originalObject;
                this.currentQuizService.quiz = new questionGroupReflection[quiz.TYPE](quiz);
                this.currentQuizService.persistToSessionStorage();
                this.themesService.updateCurrentlyUsedTheme();
                if (this.currentQuizService.quiz.sessionConfig.nicks.memberGroups.length > 1) {
                  window.sessionStorage.setItem('temp.provideNickSelection', value.payload.provideNickSelection);
                  this.router.navigate(['/nicks', 'memberGroup']);
                } else {
                  this.router.navigate(['/nicks', (value.payload.provideNickSelection ? 'select' : 'input')]);
                }
              }
            );
          } else {
            this.router.navigate(['/']);
          }
        });
      });
    });
  }

  ngOnDestroy() {
  }

}
