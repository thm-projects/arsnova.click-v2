import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IDuplicateQuiz } from 'arsnova-click-v2-types/dist/common';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbTable } from '../../../lib/enums/enums';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { QuizService } from '../quiz/quiz.service';
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
    private quizService: QuizService,
    private quizApiService: QuizApiService,
    private storageService: StorageService,
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
          this._renameFilesQueue.append('uploadFiles[]', <File>formData.getAll('uploadFiles[]').filter((file) => {
            return (<File>file).name === duplicateQuiz.fileName;
          })[0], duplicateQuiz.fileName);
        });
        this.router.navigate(['/quiz', 'rename']);
      } else {
        const allUploadedFiles = formData.getAll('uploadFiles[]');
        allUploadedFiles.forEach(formDataValue => {
          const file = <File>formDataValue;
          if (file.type !== 'application/json') {
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {

            this.quizService.quiz = new QuizEntity(JSON.parse(reader.result.toString()));
            this.quizService.persist();
            this.quizService.quiz = null;

            this.storageService.delete(DbTable.Quiz, file.name).subscribe();

            this.router.navigate(['/']);
          };
          reader.readAsText(file);
        });
      }
    }, error => {
      console.log(error);
    });
  }
}
