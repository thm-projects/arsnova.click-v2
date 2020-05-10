import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../service/storage/storage.service';

@Component({
  selector: 'app-quiz-public',
  templateUrl: './quiz-public.component.html',
  styleUrls: ['./quiz-public.component.scss'],
})
export class QuizPublicComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'QuizPublicComponent';

  private readonly _destroy = new Subject();

  public availablePublicQuizzes: Array<QuizEntity> = [];
  public isViewingOwnQuizzes = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private storageService: StorageService,
    private quizApiService: QuizApiService,
    private footerBarService: FooterBarService,
    private fileUploadService: FileUploadService,
    private router: ActivatedRoute,
  ) {
    this.footerBarService.replaceFooterElements([footerBarService.footerElemBack]);
  }

  public copyQuiz(index: number): void {
    const session = this.availablePublicQuizzes[index];
    const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
    this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, session.name);
    this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
  }

  public removeQuiz(index: number): void {
    this.quizApiService.setQuizAsPrivate(this.availablePublicQuizzes[index])
    .subscribe(() => this.availablePublicQuizzes.splice(index, 1));
  }

  public copyQuizLink(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  public getQuizLink(index: number): string {
    return encodeURI(`${location.origin}/quiz/create/${this.availablePublicQuizzes[index].name}`);
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.router.paramMap.pipe(takeUntil(this._destroy), distinctUntilChanged()).subscribe(params => {
      if (params.get('own')) {
        this.quizApiService.getOwnPublicQuizzes().subscribe(val => this.availablePublicQuizzes = val);
        this.isViewingOwnQuizzes = true;
      } else {
        this.quizApiService.getPublicQuizzes().subscribe(val => this.availablePublicQuizzes = val);
      }
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
