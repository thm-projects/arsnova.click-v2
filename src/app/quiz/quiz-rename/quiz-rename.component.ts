import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDuplicateQuiz } from 'arsnova-click-v2-types/dist/common';
import { IQuestionGroup } from 'arsnova-click-v2-types/dist/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/dist/questions/questionGroup_reflection';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-rename',
  templateUrl: './quiz-rename.component.html',
  styleUrls: ['./quiz-rename.component.scss'],
})
export class QuizRenameComponent implements OnInit {
  public static TYPE = 'QuizRenameComponent';

  constructor(public readonly fileUploadService: FileUploadService,
              private readonly footerBarService: FooterBarService,
              private readonly router: Router,
  ) {
    this.footerBarService.TYPE_REFERENCE = QuizRenameComponent.TYPE;
    this.footerBarService.replaceFooterElements([this.footerBarService.footerElemBack]);
  }

  public sendRecommendation(duplicateQuiz: IDuplicateQuiz, renameRecommendation: string): void {
    const reader = new FileReader();
    const file: File = <File>this.fileUploadService.renameFilesQueue.getAll('uploadFiles[]').find((uploadedFile) => {
      return (<File>uploadedFile).name === duplicateQuiz.fileName;
    });
    reader.addEventListener<'load'>('load', () => {
      const jsonData = JSON.parse(reader.result.toString());
      const quizData: IQuestionGroup = questionGroupReflection[jsonData.TYPE](jsonData);
      quizData.hashtag = renameRecommendation;
      const blob = new Blob([JSON.stringify(quizData.serialize())], { type: 'application/json' });
      this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, duplicateQuiz.fileName);
      this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
    });
    reader.readAsText(file);
  }

  public ngOnInit(): void {
    if (!this.fileUploadService.renameFilesQueue) {
      this.router.navigate(['/']);
    }
  }
}
