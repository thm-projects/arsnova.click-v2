import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestion } from 'arsnova-click-v2-types/dist/questions/interfaces';
import { questionReflection } from 'arsnova-click-v2-types/dist/questions/question_reflection';
import { Subscription } from 'rxjs';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../../lib/available-question-types';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss'],
})
export class QuestiontypeComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuestiontypeComponent';

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;
  private _questionType: string;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestiontypeComponent.TYPE;

    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemNicknames, this.footerBarService.footerElemProductTour,
    ]);
  }

  public isActiveQuestionType(type: string): boolean {
    return type === this._questionType;
  }

  public morphToQuestionType(type: string): void {
    if (!questionReflection[type]) {
      return;
    }

    this._question = questionReflection[type](this._question.serialize());
    this._questionType = type;
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(this._questionIndex);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(this._question, this._questionIndex);
    this.activeQuestionGroupService.persist();
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._questionType = this._question.TYPE;
    });
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

}
