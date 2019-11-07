import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { IDuplicateQuiz } from '../../lib/interfaces/quizzes/IDuplicateQuiz';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
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
          this.storageService.db.Quiz.add(quiz, quiz.name);
          this.quizApiService.putSavedQuiz(quiz).subscribe();
        });

        if (!data.payload.duplicateQuizzes.length) {
          this.router.navigate(['/']);
        }
      }

    }, error => {
      console.log('FileUploadService: PostQuizUpload failed', error);
    });
  }
}
