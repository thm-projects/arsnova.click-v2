import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {Subscription} from 'rxjs/Subscription';
import {questionReflection} from 'arsnova-click-v2-types/src/questions/question_reflection';
import {IQuestion} from 'arsnova-click-v2-types/src/questions/interfaces';
import {HeaderLabelService} from '../../../../service/header-label.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss']
})
export class QuestiontypeComponent implements OnInit, OnDestroy {
  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;
  private _questionType: string;

  readonly selectableQuestionTypes = [
    {
      id: 'MultipleChoiceQuestion',
      translationName: 'component.questions.multiple_choice_question',
      descriptionType: 'component.question_type.description.MultipleChoiceQuestion'
    },
    {
      id: 'SingleChoiceQuestion',
      translationName: 'component.questions.single_choice_question',
      descriptionType: 'component.question_type.description.SingleChoiceQuestion'
    },
    {
      id: 'YesNoSingleChoiceQuestion',
      translationName: 'component.questions.single_choice_question_yes_no',
      descriptionType: 'component.question_type.description.YesNoSingleChoiceQuestion'
    },
    {
      id: 'TrueFalseSingleChoiceQuestion',
      translationName: 'component.questions.single_choice_question_true_false',
      descriptionType: 'component.question_type.description.TrueFalseSingleChoiceQuestion'
    },
    {
      id: 'RangedQuestion',
      translationName: 'component.questions.ranged_question',
      descriptionType: 'component.question_type.description.RangedQuestion'
    },
    {
      id: 'FreeTextQuestion',
      translationName: 'component.questions.free_text_question',
      descriptionType: 'component.question_type.description.FreeTextQuestion'
    },
    {
      id: 'SurveyQuestion',
      translationName: 'component.questions.survey_question',
      descriptionType: 'component.question_type.description.SurveyQuestion'
    }
  ];

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour
    ]);
  }

  isActiveQuestionType(type) {
    return type === this._questionType;
  }

  morphToQuestionType(type) {
    this._question = questionReflection[type](this._question.serialize());
    this._questionType = type;
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(this._questionIndex);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(this._question, this._questionIndex);
    this.activeQuestionGroupService.persist();
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._questionType = this._question.TYPE;
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
