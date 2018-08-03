import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IDuplicateQuiz, IMessage } from 'arsnova-click-v2-types/dist/common';
import { questionGroupReflection } from 'arsnova-click-v2-types/dist/questions/questionGroup_reflection';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { ActiveQuestionGroupService } from '../active-question-group/active-question-group.service';
import { QuizApiService } from '../api/quiz/quiz-api.service';
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
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private quizApiService: QuizApiService,
    private storageService: StorageService,
  ) {
    this._renameFilesQueue = new FormData();
  }

  public async uploadFile(formData: FormData): Promise<void> {
    this._renameFilesQueue = new FormData();
    this._duplicateQuizzes = [];
    formData.append('privateKey', await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise());

    this.quizApiService.postQuizUpload(formData).subscribe((data: IMessage) => {
      if (data.payload.duplicateQuizzes.length) {
        this._duplicateQuizzes = data.payload.duplicateQuizzes;
        data.payload.duplicateQuizzes.forEach((duplicateQuiz: IDuplicateQuiz) => {
          this._renameFilesQueue.append('uploadFiles[]', <File>formData.getAll('uploadFiles[]').filter((file) => {
            return (
                     <File>file
                   ).name === duplicateQuiz.fileName;
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
          reader.onload = async () => {

            const parsedFile = JSON.parse(reader.result);
            this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[parsedFile.TYPE](parsedFile);
            this.activeQuestionGroupService.persist();

            this.storageService.delete(DB_TABLE.QUIZ, file.name).subscribe();

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
