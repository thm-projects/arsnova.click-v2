import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IDuplicateQuiz, IMessage } from 'arsnova-click-v2-types/src/common';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { DefaultSettings } from '../../../lib/default.settings';
import { ActiveQuestionGroupService } from '../active-question-group/active-question-group.service';

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
    private http: HttpClient,
    private router: Router,
    private activeQuestionGroupService: ActiveQuestionGroupService,
  ) {
  }

  public uploadFile(formData: FormData): void {
    this._renameFilesQueue = new FormData();
    this._duplicateQuizzes = [];
    formData.append('privateKey', window.localStorage.getItem('config.private_key'));
    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/upload`, formData).subscribe(
      (data: IMessage) => {
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
          allUploadedFiles.forEach((formDataValue, index) => {
            const file = <File>formDataValue;
            if (file.type !== 'application/json') {
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              const parsedFile = JSON.parse(reader.result);
              this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[parsedFile.TYPE](parsedFile);
              this.activeQuestionGroupService.persist();
              this.router.navigate(['/']);
            };
            reader.readAsText(file);
          });
        }
      },
      error => {
        console.log(error);
      },
    );
  }
}
