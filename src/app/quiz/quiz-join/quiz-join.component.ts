import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
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

  private _routerSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasService,
    private currentQuizService: CurrentQuizService,
    private themesService: ThemesService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      const ticket = queryParams.ticket;
      console.log('queryparams', queryParams);
      if (ticket) {
        // TODO: authorize via cas;
        this.casService.ticket = ticket;
      }
      this.route.params.subscribe(params => {
        const quizname = params.quizName;
        console.log('params', params);
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
                this.themesService.updateCurrentlyUsedTheme();
                this.router.navigate(['/nicks/' + (value.payload.provideNickSelection ? 'select' : 'input')]);
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
