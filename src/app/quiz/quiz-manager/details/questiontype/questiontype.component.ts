import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../lib/available-question-types';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { getDefaultQuestionForType } from '../../../../lib/QuizValidator';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss'],
})
export class QuestiontypeComponent extends AbstractQuizManagerDetailsComponent implements OnInit {
  public static TYPE = 'QuestiontypeComponent';

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  private _questionType: string;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    quizService: QuizService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    private translateService: TranslateService,
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route);

    footerBarService.TYPE_REFERENCE = QuestiontypeComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
    ]);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.quizService.quizUpdateEmitter.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.quizService.quiz) {
        return;
      }

      this._questionType = this._question.TYPE;
      this._selectableQuestionTypes = this._selectableQuestionTypes.sort((a) => a.id === this._questionType ? -1 : 0);
    });
  }

  public isActiveQuestionType(type: string): boolean {
    return type === this._questionType;
  }

  public morphToQuestionType(type: QuestionType): void {
    this._question = getDefaultQuestionForType(this.translateService, type, this._question);
    this._questionType = type;

    this.quizService.quiz.removeQuestion(this._questionIndex);
    this.quizService.quiz.addQuestion(this._question, this._questionIndex);
    this.quizService.persist();
  }
}
