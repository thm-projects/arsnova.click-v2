import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CloudData } from 'angular-tag-cloud-module';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent extends AbstractQuizManagerDetailsComponent implements OnInit, OnDestroy {
  public static TYPE = 'TagsComponent';

  public tagName: CloudData;
  public readonly self = this;
  @ViewChild('instance', { static: true }) public instance: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public hovered: number;

  private _tags: Array<CloudData> = [];

  get tags(): Array<CloudData> {
    return this._tags;
  }

  private _selectedTags: Array<CloudData> = [];

  public get selectedTags(): Array<CloudData> {
    return this._selectedTags;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    route: ActivatedRoute,
    quizService: QuizService,
    footerBarService: FooterBarService,
    router: Router,
    quizPoolApiService: QuizPoolApiService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route);

    footerBarService.TYPE_REFERENCE = TagsComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
    ]);
  }

  public resultFormatter(tag: CloudData): string { return `${tag.text}`; }

  public inputFormatter(tag: CloudData): string { return `${tag.text ?? tag}`; }

  public search(text$: Observable<string>): Observable<Array<CloudData>> {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map(term => {
      let data: Array<CloudData>;

      try {
        // tslint:disable-next-line:no-unused-expression
        new RegExp(term);
        data = term === '' ? this._tags : this._tags.filter(v => new RegExp(term, 'mi').test(v.text));
      } catch {
        data = this._tags;
      }

      return data.filter(v => !this.selectedTags.some(selectedTag => new RegExp(selectedTag.text, 'mi').test(v.text)));
    }));
  }

  public saveTag(): void {
    this._selectedTags.push(this.tagName.text ? this.tagName : {
      text: (
        this.tagName as unknown as string
      ).trim(),
    } as CloudData);
    this.tagName = null;
  }

  public hasTagSelected(): boolean {
    return !this.tagName;
  }

  public removeTag(tag: CloudData): void {
    const index = this._selectedTags.findIndex(v => v.text === tag.text);
    if (index === -1) {
      return;
    }

    this._selectedTags.splice(index, 1);
    this.hovered = -1;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.quizService.quizUpdateEmitter.pipe( //
      distinctUntilChanged(), //
      takeUntil(this.destroy), //
    ).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this._selectedTags = this.quizService.quiz.questionList[this._questionIndex].tags?.map(tag => (
        { text: tag }
      )) ?? [];
    });

    this.quizPoolApiService.getQuizpoolTags().subscribe(data => {
      this._tags = data.payload;
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.quizService.quiz) {
      this.quizService.quiz.questionList[this._questionIndex].tags = this.selectedTags.map(tag => tag.text);
      this.quizService.persist();
    }
  }
}
