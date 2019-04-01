import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../service/storage/storage.service';

@Component({
  selector: 'app-quiz-public',
  templateUrl: './quiz-public.component.html',
  styleUrls: ['./quiz-public.component.scss'],
})
export class QuizPublicComponent {
  public availablePublicQuizzes: Array<QuizEntity> = [];
  public isViewingOwnQuizzes = false;

  constructor(
    private storageService: StorageService,
    private quizApiService: QuizApiService,
    private footerBarService: FooterBarService,
    private fileUploadService: FileUploadService,
    private router: ActivatedRoute,
  ) {
    this.footerBarService.replaceFooterElements([footerBarService.footerElemBack]);
    this.router.params.subscribe(params => {
      if (params.own) {
        this.quizApiService.getOwnPublicQuizzes().subscribe(val => this.availablePublicQuizzes = val);
        this.isViewingOwnQuizzes = true;
      } else {
        this.quizApiService.getPublicQuizzes().subscribe(val => this.availablePublicQuizzes = val);
      }
    });
  }

  public playQuiz(index: number): void {
    const session = this.availablePublicQuizzes[index];
    const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
    this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, session.name);
    this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
  }

  public removeQuiz(index: number): void {
    this.quizApiService.setQuizAsPrivate(this.availablePublicQuizzes[index])
    .subscribe(() => this.availablePublicQuizzes.splice(index, 1));
  }

  public copyQuiz(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  public getQuizLink(index: number): string {
    return encodeURI(`${location.origin}/quiz/create/${this.availablePublicQuizzes[index].name}`);
  }

  public getTranslationForYesNo(value: boolean): string {
    return value ? 'global.yes' : 'global.no';
  }
}
