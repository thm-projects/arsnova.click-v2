import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from '../../../service/connection.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {DefaultSettings} from '../../../service/settings.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss']
})
export class ReadingConfirmationComponent implements OnInit, OnDestroy {

  private _websocketSubscription: Subscription;

  constructor(
    private connectionService: ConnectionService,
    private router: Router,
    private http: HttpClient,
    private currentQuizService: CurrentQuizService
  ) {
  }

  ngOnInit() {
    this.connectionService.authorizeWebSocket(this.currentQuizService.hashtag);
    this.handleMessages();
  }

  ngOnDestroy() {
    this._websocketSubscription.unsubscribe();
  }

  confirmReading() {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby/member/reading-confirmation`, {
      quizName: this.currentQuizService.hashtag,
      nickname: window.sessionStorage.getItem(`${this.currentQuizService.hashtag}_nick`)
    }).subscribe(
      (data: IMessage) => {
      }
    );
  }

  private handleMessages() {
    this._websocketSubscription = this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
      }
    });
  }

}
