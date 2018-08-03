import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/dist/communication_protocol';
import { questionGroupReflection } from 'arsnova-click-v2-types/dist/questions/questionGroup_reflection';
import { Subscription } from 'rxjs';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

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
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasLoginService,
    public currentQuizService: CurrentQuizService,
    private themesService: ThemesService,
    private lobbyApiService: LobbyApiService,
    private quizApiService: QuizApiService,
    private storageService: StorageService,
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.casService.ticket = queryParams.ticket;
    });

    this.route.params.subscribe(params => {
      const quizname = params.quizName;
      this.quizApiService.getQuizStatus(quizname).subscribe(quizStatusData => this.resolveQuizStatusData(quizStatusData, quizname));
    });
  }

  private resolveQuizStatusData(quizStatusData, quizname): void {
    if (quizStatusData.status !== COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL || quizStatusData.step !== COMMUNICATION_PROTOCOL.QUIZ.AVAILABLE) {
      this.router.navigate(['/']);
      return;
    }

    this.casService.casLoginRequired = quizStatusData.payload.authorizeViaCas;
    if (this.casService.casLoginRequired) {
      this.casService.quizName = quizname;
    }

    this.lobbyApiService.getLobbyStatus(quizname).subscribe(lobbyStatusData => this.resolveLobbyStatusData(quizStatusData, lobbyStatusData));
  }

  private resolveLobbyStatusData(quizStatusData, lobbyStatusData): void {
    const quiz = lobbyStatusData.payload.quiz.originalObject;

    this.currentQuizService.quiz = new questionGroupReflection[quiz.TYPE](quiz);
    this.currentQuizService.persistToSessionStorage();

    this.themesService.updateCurrentlyUsedTheme();

    if (this.currentQuizService.quiz.sessionConfig.nicks.memberGroups.length > 1) {
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.PROVIDE_NICK_SELECTION, quizStatusData.payload.provideNickSelection).subscribe();
      this.router.navigate(['/nicks', 'memberGroup']);

    } else {
      this.router.navigate([
        '/nicks',
        (
          quizStatusData.payload.provideNickSelection ? 'select' : 'input'
        ),
      ]);

    }
  }
}
