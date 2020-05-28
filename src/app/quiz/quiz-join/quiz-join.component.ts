import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { AudioPlayerConfigTarget } from '../../lib/enums/AudioPlayerConfigTarget';
import { StorageKey } from '../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../lib/enums/Message';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { IAudioPlayerConfig } from '../../lib/interfaces/IAudioConfig';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';

@Component({
  selector: 'app-quiz-join',
  templateUrl: './quiz-join.component.html',
  styleUrls: ['./quiz-join.component.scss'],
})
export class QuizJoinComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'QuizJoinComponent';
  private _quizName: string;
  private _isPending: boolean;
  private readonly _destroy = new Subject();
  public readonly audioConfig: IAudioPlayerConfig = {
    autostart: true,
    original_volume: '60',
    loop: true,
    hideControls: true,
    src: 'Song0',
    target: AudioPlayerConfigTarget.connecting
  };
  public hasApproved: boolean;
  public isLoading = true;

  get quizName(): string {
    return this._quizName;
  }

  get isPending(): boolean {
    return this._isPending;
  }

  constructor(
    public quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private casService: CasLoginService,
    private themesService: ThemesService,
    private quizApiService: QuizApiService,
    private sharedService: SharedService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private storageService: StorageService,
  ) {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.route.queryParams.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe(queryParams => {
      this.casService.ticket = queryParams.ticket;
    });

    this.route.paramMap.pipe(map(val => val.get('quizName')), distinctUntilChanged(), takeUntil(this._destroy)).subscribe(quizname => {
      if (!quizname) {
        this.router.navigate(['/']);
        return;
      }

      this._quizName = quizname;

      this.storageService.db.Quiz.get(quizname).then(quiz => {
        if (quiz) {
          const quizEntity = new QuizEntity(quiz);
          if (!quizEntity.isValid()) {
            sessionStorage.setItem(StorageKey.CurrentQuizName, quizname);
            this.router.navigate(['/quiz', 'manager', 'overview']);
            return;
          }

          this.quizApiService.setQuiz(quiz).subscribe(modifiedQuestionGroup => {
            this.quizService.quiz = new QuizEntity(modifiedQuestionGroup);
            this.quizService.isOwner = true;
            this.router.navigate(['/quiz', 'flow']);
          });
          return;
        }

        this.handleMessages();

        this.quizApiService.getFullQuizStatusData(quizname).subscribe(data => {
          this.resolveQuizStatusData(data);
        }, () => {
          this.router.navigate(['/']);
        });
      });
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public approve(): void {
    this.hasApproved = true;
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemAudio,
    ]);
  }

  private handleMessages(): void {
    this.connectionService.connectToGlobalChannel().pipe(
      switchMapTo(this.sharedService.activeQuizzesChanged),
      filter(() => this.sharedService.activeQuizzes.map(q => q.toLowerCase()).includes(this._quizName.toLowerCase())),
      switchMapTo(this.quizApiService.getFullQuizStatusData(this._quizName)),
      takeUntil(this._destroy)
    ).subscribe(data => {
      this.resolveQuizStatusData(data);
    });
  }

  private resolveQuizStatusData(quizStatusData: IMessage): void {
    if (quizStatusData.status !== StatusProtocol.Success || quizStatusData.step !== MessageProtocol.Available) {
      this._isPending = true;
      this.isLoading = false;
      return;
    }

    this.quizService.quiz = quizStatusData.payload.quiz;
    this.quizService.isOwner = false;

    this.casService.casLoginRequired = quizStatusData.payload.status.authorizeViaCas;
    if (this.casService.casLoginRequired) {
      this.casService.quizName = this.quizService.quiz.name;
    }

    this.themesService.updateCurrentlyUsedTheme();

    this._isPending = false;
    if (this.quizService.quiz.sessionConfig.nicks.memberGroups.length > 1) {
      this.router.navigate(['/nicks', 'memberGroup']);

    } else {
      this.router.navigate([
        '/nicks',
        (
          this.quizService.quiz.sessionConfig.nicks.selectedNicks.length > 0 ? 'select' : 'input'
        ),
      ]);
    }
  }
}
