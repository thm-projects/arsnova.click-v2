import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { IconParams, IconProp } from '@fortawesome/fontawesome-svg-core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { filter, switchMapTo, takeUntil } from 'rxjs/operators';
import { MessageProtocol } from '../../lib/enums/Message';
import { UserRole } from '../../lib/enums/UserRole';
import { IServerStatistics } from '../../lib/interfaces/IServerStatistics';
import { StatisticsApiService } from '../../service/api/statistics/statistics-api.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { NotificationService } from '../../service/notification/notification.service';
import { UserService } from '../../service/user/user.service';

interface IStatisticDataTile {
  iconColor: string;
  iconLayer?: Array<IconParams>;
  icon?: IconProp;
  amount: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  public statistics: IServerStatistics;
  public readonly data: Array<IStatisticDataTile> = [];

  private readonly _destroy$ = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private statisticsApiService: StatisticsApiService,
    private connectionService: ConnectionService,
    private rxStompService: RxStompService,
    private messageQueue: SimpleMQ,
    private i18nService: I18nService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {
    this.statistics = {
      quiz: {
        active: 0,
        participants: {
          active: 0,
          average: 0,
        },
        pool: {
          tags: 0,
          questions: 0,
        },
        total: 0,
      },
      activeSockets: 0,
    } as IServerStatistics;
    this.buildDataTiles();
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.connectionService.serverStatusEmitter.pipe( //
      filter(value => Boolean(value)), //
      switchMapTo(this.rxStompService.connectionState$), //
      filter(value => value === RxStompState.OPEN), //
      switchMapTo(this.i18nService.initialized), //
      switchMapTo(this.statisticsApiService.getBaseAppStatistics()), //
      takeUntil(this._destroy$), //
    ).subscribe(data => {
      this.statistics = data;
      this.buildDataTiles();
      if (this.userService.isAuthorizedFor(UserRole.SuperAdmin)) {
        this.notificationService.footerBadges['quizpool'] = this.statistics.quiz.pool.pendingQuestionAmount;
      }
    });

    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.RequestStatistics, () => {
        this.statisticsApiService.getBaseAppStatistics().subscribe(data => {
          this.statistics = data;
          this.buildDataTiles();
        });
      }),
    ]);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._messageSubscriptions.forEach(sub => this.messageQueue.unsubscribe(sub));
  }

  private buildDataTiles(): void {
    this.data.splice(0, this.data.length);

    this.data.push({
        iconColor: 'var(--success)',
        icon: 'users',
        amount: this.statistics.activeSockets,
        title: 'component.statistics.users.title',
        content: 'component.statistics.users.content',
      }, {
        iconColor: 'var(--invers)',
        icon: 'question',
        amount: this.statistics.quiz.total,
        title: 'component.statistics.total-quizzes.title',
        content: 'component.statistics.total-quizzes.content',
      }, {
        iconColor: 'var(--blue)',
        icon: 'cogs',
        amount: this.statistics.quiz.active,
        title: 'component.statistics.active-quizzes.title',
        content: 'component.statistics.active-quizzes.content',
      }, {
        iconColor: 'var(--pink)',
        iconLayer: [
          {
            classes: ['fas', 'question'],
            transform: 'shrink-3 left-5' as any,
          },
          {
            classes: ['fas', 'question'],
            transform: 'shrink-6 right-2 rotate-50' as any,
          },
          {
            classes: ['fas', 'question'],
            transform: 'shrink-5 bottom-5 left-12 rotate--30' as any,
          },
        ],
        amount: this.statistics.quiz.pool.questions,
        title: 'component.statistics.total-pool-questions.title',
        content: 'component.statistics.total-pool-questions.content',
      }, {
        iconColor: 'var(--orange)',
        icon: 'tags',
        amount: this.statistics.quiz.pool.tags,
        title: 'component.statistics.total-pool-tags.title',
        content: 'component.statistics.total-pool-tags.content',
      },
    );

    if (this.statistics.quiz.active) {
      this.data.push({
        iconColor: 'var(--cyan)',
        icon: 'user-friends',
        amount: this.statistics.quiz.participants.active,
        title: 'component.statistics.active-participants.title',
        content: 'component.statistics.active-participants.content',
      });
    }

    this.data.push({
      iconColor: 'var(--info)',
      icon: 'mobile-alt',
      amount: this.statistics.quiz.participants.average,
      title: 'component.statistics.average-participants.title',
      content: 'component.statistics.average-participants.content',
    });
  }
}
