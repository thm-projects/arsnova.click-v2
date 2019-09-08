import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesService } from '../../service/themes/themes.service';

@Component({
  selector: 'app-quiz-join',
  templateUrl: './quiz-join.component.html',
  styleUrls: ['./quiz-join.component.scss'],
})
export class QuizJoinComponent implements OnInit {
  public static TYPE = 'QuizJoinComponent';

  constructor(public quizService: QuizService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private route: ActivatedRoute,
              private router: Router,
              private casService: CasLoginService,
              private themesService: ThemesService,
              private quizApiService: QuizApiService, private sharedService: SharedService,
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.casService.ticket = queryParams.ticket;
    });
    this.route.params.subscribe(params => {
      if (!params || !params.quizName) {
        this.router.navigate(['/']);
        return;
      }

      this.sharedService.isLoadingEmitter.next(true);
      this.quizApiService.getFullQuizStatusData(params.quizName).subscribe(quizStatusData => this.resolveQuizStatusData(quizStatusData));
    });
  }

  private resolveQuizStatusData(quizStatusData): void {
    if (quizStatusData.status !== StatusProtocol.Success || quizStatusData.step !== MessageProtocol.Available) {
      this.router.navigate(['/']);
      return;
    }

    this.quizService.quiz = quizStatusData.payload.quiz.quiz;
    this.quizService.isOwner = false;

    this.casService.casLoginRequired = quizStatusData.payload.status.authorizeViaCas;
    if (this.casService.casLoginRequired) {
      this.casService.quizName = this.quizService.quiz.name;
    }

    this.themesService.updateCurrentlyUsedTheme();
    this.sharedService.isLoadingEmitter.next(false);

    if (this.quizService.quiz.sessionConfig.nicks.memberGroups.length > 1) {
      this.router.navigate(['/nicks', 'memberGroup']);

    } else {
      this.router.navigate([
        '/nicks', (quizStatusData.payload.status.provideNickSelection ? 'select' : 'input'),
      ]);
    }
  }
}
