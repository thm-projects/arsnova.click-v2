import { Injectable } from '@angular/core';
import { IDuplicateQuiz } from 'arsnova-click-v2-types/dist/common';
import { ActiveQuestionGroupService } from '../active-question-group/active-question-group.service';

@Injectable()
export class FileUploadMockService {
  get duplicateQuizzes(): Array<IDuplicateQuiz> {
    return this._duplicateQuizzes;
  }

  get renameFilesQueue(): FormData {
    return this._renameFilesQueue;
  }

  private readonly _duplicateQuizzes: Array<IDuplicateQuiz>;
  private readonly _renameFilesQueue: FormData;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService) {
    const blob = new Blob([JSON.stringify(activeQuestionGroupService.activeQuestionGroup.serialize())], { type: 'application/json' });
    const mockFile1 = new File([blob], 'test.json');
    this._renameFilesQueue = new FormData();
    this.renameFilesQueue.append('uploadFiles[]', mockFile1);
  }

  public uploadFile(): void {}
}
