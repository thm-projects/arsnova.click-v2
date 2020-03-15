import { isPlatformBrowser } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudData } from 'angular-tag-cloud-module';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, switchMapTo, takeUntil } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';
import { QuizPoolApiService } from '../../../service/api/quiz-pool/quiz-pool-api.service';
import { FileUploadService } from '../../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { SharedService } from '../../../service/shared/shared.service';

@Component({
  selector: 'app-quiz-pool-overview',
  templateUrl: './quiz-pool-overview.component.html',
  styleUrls: ['./quiz-pool-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPoolOverviewComponent implements OnInit, OnDestroy, AfterContentInit {
  public readonly form: FormGroup;

  private _tagsForCloud: Array<CloudData> = [];

  public get tagsForCloud(): Array<CloudData> {
    return this._tagsForCloud;
  }

  private _tags: Array<CloudData> = [];

  public get tags(): Array<CloudData> {
    return this._tags;
  }

  private readonly _destroy = new Subject();
  private readonly _viewInit$ = new ReplaySubject(1);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private questionPoolApiService: QuizPoolApiService,
    private footerBarService: FooterBarService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router,
    private fileUploadService: FileUploadService,
  ) {
    this.form = this.formBuilder.group({
      selectedTag: new FormControl(null, [Validators.required]),
      questionAmount: new FormControl({
        value: null,
        disabled: true,
      }, [Validators.required, this.maxQuestionAmountValidator.bind(this)]),
    });

    this.form.get('selectedTag').valueChanges.pipe(takeUntil(this._destroy)).subscribe(() => this.form.get('questionAmount').enable());
  }

  public ngOnInit(): void {
    this.footerBarService.replaceFooterElements([this.footerBarService.footerElemBack]);
  }

  public ngAfterContentInit(): void {
    this._viewInit$.next(true);

    this.questionPoolApiService.getQuizpoolTags().subscribe(data => {
      this._tags = data.payload;
      const loading$ = this.sharedService.isLoadingEmitter.pipe(filter(() => isPlatformBrowser(this.platformId)));
      loading$.pipe(filter(v => !v), switchMapTo(this._viewInit$), distinctUntilChanged(), takeUntil(this._destroy)).subscribe(() => {
        this._tagsForCloud = this._tags;
        setTimeout(() => this.cd.markForCheck(), 200);
      });
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public createQuiz(): void {
    this.questionPoolApiService.getQuizpool([this.form.get('selectedTag').value], this.form.get('questionAmount').value).subscribe(questions => {
      const defaultConfig = DefaultSettings.defaultQuizSettings.sessionConfig;
      const questionGroup = new QuizEntity({
        name: null,
        questionList: questions.payload,
        sessionConfig: new SessionConfigurationEntity(defaultConfig)
      });

      const blob = new Blob([JSON.stringify(questionGroup)], { type: 'application/json' });
      this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, questionGroup.name);
      this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
    });
  }

  public getSelectedTag(): CloudData {
    if (!(
      this.form?.get('selectedTag')?.value ?? false
    )) {
      return null;
    }
    return this._tags.find(v => v.text === this.form.get('selectedTag').value);
  }

  public createQuestion(): void {
    this.router.navigate(['/', 'quiz', 'manager', 'quiz-pool', 'overview']);
  }

  private maxQuestionAmountValidator(control): ValidationErrors {
    if (!(
      this.form?.get('selectedTag')?.value ?? false
    ) || !this.getSelectedTag()) {
      return {};
    }
    if (!control.value) {
      return { required: true };
    }
    if (control.value <= 0 || control.value > this.getSelectedTag().weight) {
      return { max: true };
    }

    return {};
  }
}
