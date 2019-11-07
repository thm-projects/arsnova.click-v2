import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { MessageProtocol } from '../../lib/enums/Message';
import { QuizState } from '../../lib/enums/QuizState';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss'],
})
export class AvailableQuizzesComponent {
  public static TYPE = 'AvailableQuizzesComponent';
  public startingQuiz: QuizEntity;

  private _sessions: Array<QuizEntity> = [];

  get sessions(): Array<QuizEntity> {
    return this._sessions;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public connectionService: ConnectionService,
    private activeModal: NgbActiveModal,
    private router: Router,
    private quizService: QuizService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService,
    private quizApiService: QuizApiService,
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

  public async startQuiz(session: QuizEntity): Promise<any> {
    this.startingQuiz = session;
    return new Promise(async resolve => {
      this.trackingService.trackClickEvent({
        action: AvailableQuizzesComponent.TYPE,
        label: 'start-quiz',
      });

      if (!session.isValid()) {
        this.router.navigate(['/quiz', 'manager']);
        resolve();
        return;
      }

      this.quizApiService.getQuiz(session.name).subscribe((data) => {
        if (data.payload.state === QuizState.Inactive || [MessageProtocol.Unavailable, MessageProtocol.Editable].includes(data.step)) {
          if ([MessageProtocol.Unavailable, MessageProtocol.Editable].includes(data.step)) {
            this.quizService.quiz = session;
          } else {
            this.quizService.quiz = new QuizEntity(data.payload.quiz);
          }
          this.quizService.isOwner = true;
          this.quizService.persist();

          this.quizApiService.setQuiz(this.quizService.quiz).subscribe((updatedQuiz) => {
            this.quizService.quiz = new QuizEntity(updatedQuiz);
            this.router.navigate(['/quiz', 'flow']);
          }, () => this.startingQuiz = null, () => {
            this.next();
            resolve();
          });

        } else if (data.step === MessageProtocol.AlreadyTaken || //
                   [QuizState.Active, QuizState.Running, QuizState.Finished].includes(data.payload.state)) {

          const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
          this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, session.name);
          this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
          this.next();
          resolve();
        }
      }, () => this.startingQuiz = null);
    });
  }

  public editQuiz(session: QuizEntity): void {
    this.trackingService.trackClickEvent({
      action: AvailableQuizzesComponent.TYPE,
      label: 'edit-quiz',
    });

    this.quizService.quiz = new QuizEntity(session);
    this.quizService.isOwner = true;
    this.router.navigate(['/quiz', 'manager']);
    this.next();
  }

  private loadData(): Promise<void> {
    return this.storageService.db.Quiz.toCollection().sortBy('name').then(quizzes => {
      quizzes.forEach(quiz => this.sessions.push(new QuizEntity(quiz)));
    });
  }

}
