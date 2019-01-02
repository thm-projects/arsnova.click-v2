import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IModal } from 'arsnova-click-v2-types/dist/modals/interfaces';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbTable } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { QuizState } from '../../../lib/enums/QuizState';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss'],
})
export class AvailableQuizzesComponent implements IModal {
  public static TYPE = 'AvailableQuizzesComponent';

  private _sessions: Array<QuizEntity> = [];

  get sessions(): Array<QuizEntity> {
    return this._sessions;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
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

      this.quizApiService.getQuizStatus(session.name).subscribe((data) => {
        if (data.payload.state === QuizState.Inactive || data.step === MessageProtocol.Unavailable) {
          this.quizService.quiz = new QuizEntity(session);
          this.quizService.isOwner = true;
          this.quizService.persist();

          this.quizApiService.setQuiz(this.quizService.quiz).subscribe((updatedQuiz) => {
            this.quizService.quiz = new QuizEntity(updatedQuiz);
            sessionStorage.setItem('token', updatedQuiz.adminToken);
            this.router.navigate(['/quiz', 'flow']);
          }, () => {}, () => {
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
      });
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

  private async loadData(): Promise<void> {
    this.storageService.getAll(DbTable.Quiz).subscribe(quizzes => {
      quizzes.sort((a: any, b: any) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
      quizzes.forEach(quiz => this.sessions.push(new QuizEntity(quiz.value)));
    });
  }

}
