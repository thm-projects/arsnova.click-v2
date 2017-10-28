import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {DefaultSettings} from './settings.service';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AvailableQuizzesComponent} from '../modals/available-quizzes/available-quizzes.component';
import {ActiveQuestionGroupService} from './active-question-group.service';
import {questionGroupReflection} from '../../lib/questions/questionGroup_reflection';

export declare interface IDuplicateQuiz {
  quizName: string;
  fileName: string;
  renameRecommendation: Array<string>;
}

@Injectable()
export class FileUploadService {
  get duplicateQuizzes(): Array<IDuplicateQuiz> {
    return this._duplicateQuizzes;
  }
  get renameFilesQueue(): FormData {
    return this._renameFilesQueue;
  }

  private _renameFilesQueue: FormData;
  private _duplicateQuizzes: Array<IDuplicateQuiz>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private activeQuestionGroupService: ActiveQuestionGroupService
  ) { }

  uploadFile(formData: FormData) {
    this._renameFilesQueue = new FormData();
    this._duplicateQuizzes = [];
    formData.append('privateKey', window.localStorage.getItem('config.private_key'));
    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/upload`, formData)
        .subscribe(
          (data: IMessage) => {
            if (data.payload.duplicateQuizzes.length) {
              this._duplicateQuizzes = data.payload.duplicateQuizzes;
              data.payload.duplicateQuizzes.forEach((duplicateQuiz: IDuplicateQuiz) => {
                if (formData.has(duplicateQuiz.fileName)) {
                  this._renameFilesQueue.append('uploadFiles[]', <File>formData.get(duplicateQuiz.fileName), duplicateQuiz.fileName);
                }
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
                  if (index === allUploadedFiles.length - 1) {
                    this.modalService.open(AvailableQuizzesComponent);
                  }
                };
                reader.readAsText(file);
              });
            }
            console.log(data);
          },
          error => {
            console.log(error);
          }
        );
  }
}
