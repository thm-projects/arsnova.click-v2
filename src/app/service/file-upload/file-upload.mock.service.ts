import { Injectable } from '@angular/core';
import { IDuplicateQuiz } from 'arsnova-click-v2-types/dist/common';
import { QuizService } from '../quiz/quiz.service';

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

  constructor(private quizService: QuizService) {
    const blob = new Blob([JSON.stringify(quizService.quiz)], { type: 'application/json' });
    const mockFile1 = new File([blob], 'test.json');
    this._renameFilesQueue = new FormData();
    this.renameFilesQueue.append('uploadFiles[]', mockFile1);
  }

  public uploadFile(): void {}
}
