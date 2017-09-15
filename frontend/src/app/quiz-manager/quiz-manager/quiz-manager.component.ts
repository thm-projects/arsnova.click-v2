import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {FooterBarService} from "../../service/footer-bar.service";
import {HeaderLabelService} from "../../service/header-label.service";
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {questionReflection} from "../../../lib/questions/question_reflection";
import {QuestionGroupI} from "../../../lib/questions/QuestionGroupI";

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss']
})
export class QuizManagerComponent implements OnInit {
  get showMoreOrLess(): string {
    return this._showMoreOrLess;
  }

  set showMoreOrLess(value: string) {
    this._showMoreOrLess = value;
  }
  readonly selectableQuestionTypes = [
    {
      id: "MultipleChoiceQuestion",
      translationName: "component.questions.multiple_choice_question",
      descriptionType: 'component.question_type.description.MultipleChoiceQuestion'
    },
    {
      id: "SingleChoiceQuestion",
      translationName: "component.questions.single_choice_question",
      descriptionType: 'component.question_type.description.SingleChoiceQuestion'
    },
    {
      id: "YesNoSingleChoiceQuestion",
      translationName: "component.questions.single_choice_question_yes_no",
      descriptionType: 'component.question_type.description.YesNoSingleChoiceQuestion'
    },
    {
      id: "TrueFalseSingleChoiceQuestion",
      translationName: "component.questions.single_choice_question_true_false",
      descriptionType: 'component.question_type.description.TrueFalseSingleChoiceQuestion'
    },
    {
      id: "RangedQuestion",
      translationName: "component.questions.ranged_question",
      descriptionType: 'component.question_type.description.RangedQuestion'
    },
    {
      id: "FreeTextQuestion",
      translationName: "component.questions.free_text_question",
      descriptionType: 'component.question_type.description.FreeTextQuestion'
    },
    {
      id: "SurveyQuestion",
      translationName: "component.questions.survey_question",
      descriptionType: 'component.question_type.description.SurveyQuestion'
    }
  ];

  readonly questionGroupItem: QuestionGroupI;

  private _showMoreOrLess: string = 'component.quiz_manager.show_more';

  constructor(@Inject(DOCUMENT) readonly document,
              private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private activeQuestionGroupService: ActiveQuestionGroupService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemHome,
      FooterBarComponent.footerElemStartQuiz,
      FooterBarComponent.footerElemProductTour,
      FooterBarComponent.footerElemNicknames,
    ]);
    headerLabelService.setHeaderLabel("component.quiz_manager.title");
    this.questionGroupItem = activeQuestionGroupService.activeQuestionGroup;
    FooterBarComponent.footerElemStartQuiz.isActive = activeQuestionGroupService.activeQuestionGroup.isValid();
  }

  ngOnInit() {
  }

  switchShowMoreOrLess() {
    if (this._showMoreOrLess.indexOf("more") > -1) {
      this._showMoreOrLess = this._showMoreOrLess.replace("more", "less");
    } else {
      this._showMoreOrLess = this._showMoreOrLess.replace("less", "more");
    }
  }

  addQuestion(id: string) {
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(questionReflection[id]({}));
    FooterBarComponent.footerElemStartQuiz.isActive = this.activeQuestionGroupService.activeQuestionGroup.isValid();
    this.activeQuestionGroupService.persist();
  }

  moveQuestionUp(id: number) {
    const question = this.activeQuestionGroupService.activeQuestionGroup.questionList[id];
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(question, id - 1);
    this.activeQuestionGroupService.persist();
  }

  moveQuestionDown(id: number) {
    const question = this.activeQuestionGroupService.activeQuestionGroup.questionList[id];
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(question, id + 1);
    this.activeQuestionGroupService.persist();
  }

  deleteQuestion(id: number) {
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    FooterBarComponent.footerElemStartQuiz.isActive = this.activeQuestionGroupService.activeQuestionGroup.isValid();
    this.activeQuestionGroupService.persist();
  }
}
