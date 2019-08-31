import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IDuplicateQuiz } from 'arsnova-click-v2-types/dist/common';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbState, DbTable } from '../../../lib/enums/enums';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class FileUploadService {
  private _renameFilesQueue: FormData;

  get renameFilesQueue(): FormData {
    return this._renameFilesQueue;
  }

  private _duplicateQuizzes: Array<IDuplicateQuiz>;

  get duplicateQuizzes(): Array<IDuplicateQuiz> {
    return this._duplicateQuizzes;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private storageService: StorageService,
    private quizApiService: QuizApiService,
    private indexedDbService: IndexedDbService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this._renameFilesQueue = new FormData();
    }
  }

  public uploadFile(formData: FormData): void {
    this._renameFilesQueue = new FormData();
    this._duplicateQuizzes = [];

    this.quizApiService.postQuizUpload(formData).subscribe((data: IMessage) => {
      if (data.payload.duplicateQuizzes.length) {
        this._duplicateQuizzes = data.payload.duplicateQuizzes;
        data.payload.duplicateQuizzes.forEach((duplicateQuiz: IDuplicateQuiz) => {
          this._renameFilesQueue.append('uploadFiles[]', <File>formData.getAll('uploadFiles[]').find((file) => {
            return (<File>file).name === duplicateQuiz.fileName;
          }), duplicateQuiz.fileName);
        });
        this.router.navigate(['/quiz', 'rename']);
      }

      if (data.payload.quizData.length) {
        data.payload.quizData.forEach(quizData => {
          const quiz = new QuizEntity(quizData.quiz);
          this.storageService.create(DbTable.Quiz, quiz.name, quiz).subscribe();
          this.quizApiService.putSavedQuiz(quiz).subscribe();
        });

        if (!data.payload.duplicateQuizzes.length) {
          this.indexedDbService.stateNotifier.next(DbState.Revalidate);
          this.router.navigate(['/']);
        }
      }

    }, error => {
      console.log('FileUploadService: PostQuizUpload failed', error);
    });
  }
}
