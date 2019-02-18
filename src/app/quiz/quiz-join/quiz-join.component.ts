import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { ThemesService } from '../../service/themes/themes.service';

@Component({
  selector: 'app-quiz-join',
  templateUrl: './quiz-join.component.html',
  styleUrls: ['./quiz-join.component.scss'],
})
export class QuizJoinComponent implements OnInit {
  public static TYPE = 'QuizJoinComponent';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasLoginService,
    public quizService: QuizService,
    private themesService: ThemesService,
    private quizApiService: QuizApiService,
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
    if (quizStatusData.status !== StatusProtocol.Success || quizStatusData.step !== MessageProtocol.Available) {
      this.router.navigate(['/']);
      return;
    }

    this.casService.casLoginRequired = quizStatusData.payload.authorizeViaCas;
    if (this.casService.casLoginRequired) {
      this.casService.quizName = quizname;
    }

    this.resolveLobbyStatusData(quizStatusData, quizname);
  }

  private resolveLobbyStatusData(quizStatusData, quizname): void {
    this.quizApiService.getQuiz(quizname).subscribe(quizData => {
      this.quizService.quiz = quizData.payload.quiz;
      this.quizService.isOwner = false;
      this.themesService.updateCurrentlyUsedTheme();

      if (quizData.payload.quiz.sessionConfig.nicks.memberGroups.length > 1) {
        this.router.navigate(['/nicks', 'memberGroup']);

      } else {
        this.router.navigate([
          '/nicks', (quizStatusData.payload.provideNickSelection ? 'select' : 'input'),
        ]);

      }
    });
  }
}
