import { QuestionType } from './enums/QuestionType';

export declare interface IAvailableQuestionType {
  id: QuestionType;
  translationName: string;
  descriptionType: string;
}

export const availableQuestionTypes: Array<IAvailableQuestionType> = [
  {
    id: QuestionType.MultipleChoiceQuestion,
    translationName: 'component.questions.multiple_choice_question',
    descriptionType: 'component.question_type.description.MultipleChoiceQuestion',
  }, {
    id: QuestionType.SingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question',
    descriptionType: 'component.question_type.description.SingleChoiceQuestion',
  }, {
    id: QuestionType.ABCDSingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question_abcd',
    descriptionType: 'component.question_type.description.AbcdSingleChoiceQuestion',
  }, {
    id: QuestionType.YesNoSingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question_yes_no',
    descriptionType: 'component.question_type.description.YesNoSingleChoiceQuestion',
  }, {
    id: QuestionType.TrueFalseSingleChoiceQuestion,
    translationName: 'component.questions.single_choice_question_true_false',
    descriptionType: 'component.question_type.description.TrueFalseSingleChoiceQuestion',
  }, {
    id: QuestionType.RangedQuestion,
    translationName: 'component.questions.ranged_question',
    descriptionType: 'component.question_type.description.RangedQuestion',
  }, {
    id: QuestionType.FreeTextQuestion,
    translationName: 'component.questions.free_text_question',
    descriptionType: 'component.question_type.description.FreeTextQuestion',
  }, {
    id: QuestionType.SurveyQuestion,
    translationName: 'component.questions.survey_question',
    descriptionType: 'component.question_type.description.SurveyQuestion',
  },
];
