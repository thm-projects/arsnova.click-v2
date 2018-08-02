import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { IModal } from 'arsnova-click-v2-types/src/modals/interfaces';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { StorageService } from '../../service/storage/storage.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss'],
})
export class AvailableQuizzesComponent implements IModal {
  public static TYPE = 'AvailableQuizzesComponent';

  private _sessions: Array<IQuestionGroup> = [];

  get sessions(): Array<IQuestionGroup> {
    return this._sessions;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activeModal: NgbActiveModal,
    private router: Router,
    private currentQuizService: CurrentQuizService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService,
    private quizApiService: QuizApiService,
    private lobbyApiService: LobbyApiService,
    private storageService: StorageService,
  ) {
    this.loadData();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public abort(): void {
    this.activeModal.close();
  }

  public next(): void {
    this.activeModal.close();
  }

  public async startQuiz(session: IQuestionGroup): Promise<any> {
    return new Promise(async resolve => {
      this.trackingService.trackClickEvent({
        action: AvailableQuizzesComponent.TYPE,
        label: 'start-quiz',
      });

      const quizStatusData = await this.quizApiService.getQuizStatus(session.hashtag).toPromise();
      if (quizStatusData.status !== COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
        resolve();
        return;
      }
      if (quizStatusData.step === COMMUNICATION_PROTOCOL.QUIZ.UNDEFINED) {
        await this.quizApiService.postQuizReservationOverride({
          quizName: session.hashtag,
          privateKey: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise(),
        }).toPromise();

      } else if (quizStatusData.step === COMMUNICATION_PROTOCOL.QUIZ.AVAILABLE) {

        const blob = new Blob([JSON.stringify(session.serialize())], { type: 'application/json' });
        this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, session.hashtag);
        this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);

        this.next();
        resolve();
        return;
      }

      if (!session.isValid()) {
        this.activeQuestionGroupService.activeQuestionGroup = session;
        this.router.navigate(['/quiz', 'manager']);
        resolve();
        return;
      }

      this.currentQuizService.quiz = session;
      await this.currentQuizService.cacheQuiz();

      const openQuizRequestData = await this.lobbyApiService.putLobby({
        quiz: this.currentQuizService.quiz.serialize(),
      }).toPromise();

      if (openQuizRequestData.status === COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
        this.router.navigate(['/quiz', 'flow']);
      }

      this.next();

      resolve();
    });
  }

  public editQuiz(session: IQuestionGroup): void {
    this.trackingService.trackClickEvent({
      action: AvailableQuizzesComponent.TYPE,
      label: 'edit-quiz',
    });

    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.router.navigate(['/quiz', 'manager']);
    this.next();
  }

  private async loadData(): Promise<void> {
    const sessions = await this.storageService.getAllQuiznames();
    sessions.sort((a: string, b: string) => 0 - (
      a > b ? 1 : -1
    ));
    sessions.forEach(async (elem) => {
      const quizData = await this.storageService.read(DB_TABLE.QUIZ, elem).toPromise();
      this.sessions.push(questionGroupReflection[quizData.TYPE](quizData));
    });
  }

}
