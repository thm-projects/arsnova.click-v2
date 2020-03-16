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
  public readonly formGroups: Array<FormGroup> = [];
  public displayQuestionAmountWarning = true;

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
    this.addTagRow(true);
  }

  public ngOnInit(): void {
    this.footerBarService.replaceFooterElements([this.footerBarService.footerElemBack]);
    this.footerBarService.footerElemBack.onClickCallback = () => this.router.navigate(['/']);
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

    this.footerBarService.footerElemBack.restoreClickCallback();
  }

  public createQuiz(): void {
    this.questionPoolApiService.getQuizpool(this.formGroups.map(fg => (
      { tag: fg.get('selectedTag').value, amount: fg.get('questionAmount').value }
    ))).subscribe(questions => {
      const defaultConfig = DefaultSettings.defaultQuizSettings.sessionConfig;
      const questionGroup = new QuizEntity({
        name: null,
        questionList: questions.payload,
        sessionConfig: new SessionConfigurationEntity(defaultConfig),
      });

      const blob = new Blob([JSON.stringify(questionGroup)], { type: 'application/json' });
      this.fileUploadService.renameFilesQueue.set('uploadFiles[]', blob, questionGroup.name);
      this.fileUploadService.uploadFile(this.fileUploadService.renameFilesQueue);
    });
  }

  public getSelectedTag(row: FormGroup): CloudData {
    if (!(
      row?.get('selectedTag')?.value ?? false
    )) {
      return null;
    }
    return this._tags.find(v => v.text === row.get('selectedTag').value);
  }

  public createQuestion(): void {
    this.router.navigate(['/', 'quiz', 'manager', 'quiz-pool', 'overview']);
  }

  public addTagRow(force?: boolean): void {
    if (!force && this.formGroups.length === this.tags.length) {
      return;
    }

    const index = this.formGroups.push(this.formBuilder.group({
      selectedTag: new FormControl(null, [Validators.required]),
      questionAmount: new FormControl({
        value: null,
        disabled: true,
      }, [Validators.required, this.maxQuestionAmountValidator.bind(this)]),
    })) - 1;

    this.formGroups[index].get('selectedTag').valueChanges.pipe(takeUntil(this._destroy))
    .subscribe(() => this.formGroups[index].get('questionAmount').enable());
  }

  public removeTagRow(row: FormGroup): void {
    const index = this.formGroups.findIndex(fg => fg === row);
    if (index === -1 || this.formGroups.length === 0) {
      return;
    }

    this.formGroups.splice(index, 1);
  }

  public isFormInValid(): boolean {
    return this.formGroups.some(fg => fg.invalid);
  }

  public questionAmount(): number {
    return this.formGroups.map(fg => fg.get('questionAmount').value ?? 0).reduce((previous, current) => previous + current);
  }

  public isAlreadySelected(value: CloudData): boolean {
    return this.formGroups.some(fg => fg.get('selectedTag').value === value.text);
  }

  private maxQuestionAmountValidator(control): ValidationErrors {
    if (!(
      control.parent?.get('selectedTag')?.value ?? false
    ) || !this.getSelectedTag(control.parent)) {
      return {};
    }
    if (!control.value) {
      return { required: true };
    }
    if (control.value <= 0 || control.value > this.getSelectedTag(control.parent).weight) {
      return { max: true };
    }

    return {};
  }
}
