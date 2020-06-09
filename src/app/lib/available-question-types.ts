import { QuestionType } from './enums/QuestionType';

export declare interface IAvailableQuestionType {
  id: QuestionType;
  translationName: string;
  descriptionType: string;
  descriptionHotkey: string;
}

export const availableQuestionTypes: Array<IAvailableQuestionType> = [
  {
    id: QuestionType.MultipleChoiceQuestion,
    translationName: 'component.questions.multiple_choice_question',
    descriptionType: 'view.question_type.description.MultipleChoiceQuestion',
    descriptionHotkey: 'hotkey.MultipleChoiceQuestion.description',
  }, {
    id: QuestionType.SingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question',
    descriptionType: 'view.question_type.description.SingleChoiceQuestion',
    descriptionHotkey: 'hotkey.SingleChoiceQuestion.description',
  }, {
    id: QuestionType.ABCDSurveyQuestion,
    translationName: 'component.questions.survey_question_abcd',
    descriptionType: 'view.question_type.description.ABCDSurveyQuestion',
    descriptionHotkey: 'hotkey.ABCDSurveyQuestion.description',
  }, {
    id: QuestionType.YesNoSingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question_yes_no',
    descriptionType: 'view.question_type.description.YesNoSingleChoiceQuestion',
    descriptionHotkey: 'hotkey.YesNoSingleChoiceQuestion.description',
  }, {
    id: QuestionType.TrueFalseSingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question_true_false',
    descriptionType: 'view.question_type.description.TrueFalseSingleChoiceQuestion',
    descriptionHotkey: 'hotkey.TrueFalseSingleChoiceQuestion.description',
  }, {
    id: QuestionType.RangedQuestion,
    translationName: 'component.questions.ranged_question',
    descriptionType: 'view.question_type.description.RangedQuestion',
    descriptionHotkey: 'hotkey.RangedQuestion.description',
  }, {
    id: QuestionType.FreeTextQuestion,
    translationName: 'component.questions.free_text_question',
    descriptionType: 'view.question_type.description.FreeTextQuestion',
    descriptionHotkey: 'hotkey.FreeTextQuestion.description',
  }, {
    id: QuestionType.SurveyQuestion,
    translationName: 'component.questions.survey_question',
    descriptionType: 'view.question_type.description.SurveyQuestion',
    descriptionHotkey: 'hotkey.SurveyQuestion.description',
  },
];
