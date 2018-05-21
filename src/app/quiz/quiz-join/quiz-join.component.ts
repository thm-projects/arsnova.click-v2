import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { Observable, Subscription } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { CasService } from '../../service/cas/cas.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { ThemesService } from '../../service/themes/themes.service';

@Component({
  selector: 'app-quiz-join',
  templateUrl: './quiz-join.component.html',
  styleUrls: ['./quiz-join.component.scss'],
})
export class QuizJoinComponent implements OnInit {
  public static TYPE = 'QuizJoinComponent';

  private _routerSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasService,
    public currentQuizService: CurrentQuizService,
    private themesService: ThemesService,
  ) {
  }

  public ngOnInit(): Observable<void> {
    return new Observable(subscriber => {
        (async () => {

          const queryParams = await this.route.queryParams.toPromise();
          if (queryParams && queryParams.ticket) {
            this.casService.ticket = queryParams.ticket;
          }

          const params = await this.route.params.toPromise();
          const quizname = params.quizName;

          this.queryQuizStatus(quizname).subscribe(quizStatusData => this.resolveQuizStatusData(quizStatusData, quizname));

          return;
        })().then(() => subscriber.next());
      },
    );
  }

  private queryQuizStatus(quizname): Observable<IMessage> {
    return this.http.get<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/status/${quizname}`);
  }

  private queryLobbyStatus(quizname): Observable<IMessage> {
    return this.http.get<IMessage>(`${DefaultSettings.httpApiEndpoint}/lobby/${quizname}`);
  }

  private resolveQuizStatusData(quizStatusData, quizname): void {
    if (quizStatusData.status !== 'STATUS:SUCCESSFUL' || quizStatusData.step !== 'QUIZ:AVAILABLE') {
      this.router.navigate(['/']);
      return;
    }

    this.casService.casLoginRequired = quizStatusData.payload.authorizeViaCas;
    if (this.casService.casLoginRequired) {
      this.casService.quizName = quizname;
    }

    this.queryLobbyStatus(quizname).subscribe(lobbyStatusData => this.resolveLobbyStatusData(quizStatusData, lobbyStatusData));
  }

  private resolveLobbyStatusData(quizStatusData, lobbyStatusData): void {
    const quiz = lobbyStatusData.payload.quiz.originalObject;

    this.currentQuizService.quiz = new questionGroupReflection[quiz.TYPE](quiz);
    this.currentQuizService.persistToSessionStorage();

    this.themesService.updateCurrentlyUsedTheme();

    if (this.currentQuizService.quiz.sessionConfig.nicks.memberGroups.length > 1) {
      window.sessionStorage.setItem('temp.provideNickSelection', quizStatusData.payload.provideNickSelection);
      this.router.navigate(['/nicks', 'memberGroup']);

    } else {
      this.router.navigate(['/nicks', (quizStatusData.payload.provideNickSelection ? 'select' : 'input')]);

    }
  }
}
