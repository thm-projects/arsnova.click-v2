import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FileUploadService, IDuplicateQuiz} from '../../service/file-upload.service';
import {Router} from '@angular/router';
import {FooterBarService} from '../../service/footer-bar.service';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';

@Component({
  selector: 'app-quiz-rename',
  templateUrl: './quiz-rename.component.html',
  styleUrls: ['./quiz-rename.component.scss']
})
export class QuizRenameComponent implements OnInit, OnDestroy {

  constructor(
    public fileUploadService: FileUploadService,
    private footerBarService: FooterBarService,
    private router: Router) {
    this.footerBarService.replaceFooterElements([this.footerBarService.footerElemBack]);
  }

  sendRecommendation(duplicateQuiz: IDuplicateQuiz, renameRecommendation: string, index: number) {
    const reader = new FileReader();
    const file: File = <File>this.fileUploadService.renameFilesQueue.getAll('uploadFiles[]').filter((uploadedFile) => {
      return (<File>uploadedFile).name === duplicateQuiz.fileName;
    })[0];
    reader.addEventListener('load', () => {
      const jsonData = JSON.parse(reader.result);
      const quizData: IQuestionGroup = questionGroupReflection[jsonData.TYPE](jsonData);
      quizData.hashtag = renameRecommendation;
      const blob = new Blob([JSON.stringify(quizData.serialize())], {type: 'application/json'});
      this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, duplicateQuiz.fileName);
      this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
    });
    reader.readAsText(file);
  }

  ngOnInit() {
    if (!this.fileUploadService.renameFilesQueue) {
      this.router.navigate(['/']);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
  }

}
