import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CloudData } from 'angular-tag-cloud-module';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';
import { QuizPoolApiService } from '../../../service/api/quiz-pool/quiz-pool-api.service';
import { FileUploadService } from '../../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SharedService } from '../../../service/shared/shared.service';

@Component({
  selector: 'app-quiz-pool-overview',
  templateUrl: './quiz-pool-overview.component.html',
  styleUrls: ['./quiz-pool-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPoolOverviewComponent implements OnInit, OnDestroy, AfterContentInit {
  public readonly formGroup: FormGroup;
  public displayQuestionAmountWarning = true;
  public readonly self = this;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  @ViewChild('instance', { static: false }) public instance: NgbTypeahead;

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
    private quizService: QuizService,
    private translate: TranslateService,
  ) {
    this.formGroup = this.formBuilder.group({
      selectedTag: new FormControl(null, { validators: [this.hasValidTagSelected.bind(this)], updateOn: 'change' }),
      selectedTags: new FormControl([]),
      questionAmount: new FormControl({
        value: null,
        disabled: true,
      }, [this.maxQuestionAmountValidator.bind(this)]),
    });

    this.formGroup.get('selectedTag').valueChanges.pipe(distinctUntilChanged(), takeUntil(this._destroy))
    .subscribe((value) => {
      const questionAmountControl = this.formGroup.get('questionAmount');
      if (value) {
        questionAmountControl.enable();
        if (questionAmountControl.touched) {
          questionAmountControl.markAsTouched();
        }
      } else {
        questionAmountControl.reset();
        questionAmountControl.disable();
      }
    });
  }

  public resultFormatter(tag: CloudData): string {
    return this.translate.instant('component.quiz-pool.tag-available', { text: tag.text, weight: tag.weight });
  }

  public inputFormatter(tag: CloudData): string {
    return `${tag.text ?? tag}`;
  }

  public search(text$: Observable<string>): Observable<Array<CloudData>> {
    const debouncedText$ = text$.pipe(debounceTime(200), map(term => (
      { text: term }
    )), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map((term: CloudData) => {
      let data: Array<CloudData>;

      try {
        // tslint:disable-next-line:no-unused-expression
        new RegExp(term.text);
        data = !term.text ? this._tags : this._tags.filter(v => new RegExp(term.text, 'mi').test(v.text));
      } catch {
        data = this._tags;
      }

      data = data.filter(v => !this.formGroup.get('selectedTags').value.some(selectedTag => new RegExp(selectedTag.tag, 'mi').test(v.text)));
      return data.slice(0, 10);
    }));
  }

  public saveTag(): void {
    const index = this.formGroup.get('selectedTags').value.findIndex(v => v.tag === this.formGroup.get('selectedTag').value.text);
    const data = {
      tag: this.formGroup.get('selectedTag').value.text,
      amount: this.formGroup.get('questionAmount').value,
    };
    if (index > -1) {
      this.formGroup.get('selectedTags').value[index] = data;
    } else {
      this.formGroup.get('selectedTags').value.push(data);
    }
    this.formGroup.get('selectedTag').reset();
    this.formGroup.get('questionAmount').reset();
  }

  public removeTag(): void {
    const index = this.formGroup.get('selectedTags').value.findIndex(v => v.tag === this.formGroup.get('selectedTag').value.text);
    if (index === -1) {
      return;
    }

    this.formGroup.get('selectedTags').value.splice(index, 1);
    this.formGroup.get('selectedTag').reset();
    this.formGroup.get('questionAmount').reset();
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
    this.questionPoolApiService.getQuizpool(this.formGroup.get('selectedTags').value).subscribe(questions => {
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
    return row.get('selectedTag').value;
  }

  public createQuestion(): void {
    this.quizService.cleanUp();
    this.router.navigate(['/', 'quiz', 'manager', 'quiz-pool', 'overview']);
  }

  public questionAmount(): number {
    return this.formGroup.get('selectedTags').value.reduce((a, b) => a + b.amount, 0);
  }

  public selectTag(tag: string): void {
    const tagData = this.formGroup.get('selectedTags').value.find(v => v.tag === tag);
    this.formGroup.get('selectedTag').setValue(this.tags.find(v => v.text === tag));
    this.formGroup.get('questionAmount').setValue(tagData.amount);
  }

  public hasTagSelected(): boolean {
    return this.formGroup.get('selectedTags').value.some(v => v.tag === this.formGroup.get('selectedTag').value?.text);
  }

  private maxQuestionAmountValidator(control: AbstractControl): ValidationErrors {
    if (!this.getSelectedTag(control.parent as FormGroup)) {
      return {};
    }

    const parsedValue = parseInt(control.value, 10);
    if (isNaN(parsedValue)) {
      return { required: true };
    }
    if (parsedValue <= 0) {
      return { min: true };
    }
    if (parsedValue > this.getSelectedTag(control.parent as FormGroup).weight) {
      return { max: true };
    }

    return {};
  }

  private hasValidTagSelected(control: AbstractControl): ValidationErrors {
    if (control.pristine) {
      return {};
    }

    if (!control.value?.hasOwnProperty('text')) {
      return { invalid: true };
    }

    return {};
  }
}
