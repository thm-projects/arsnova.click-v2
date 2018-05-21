export declare interface IAvailableQuestionType {
  id: string;
  translationName: string;
  descriptionType: string;
}

export const availableQuestionTypes: Array<IAvailableQuestionType> = [
  {
    id: 'MultipleChoiceQuestion',
    translationName: 'component.questions.multiple_choice_question',
    descriptionType: 'component.question_type.description.MultipleChoiceQuestion',
  },
  {
    id: 'SingleChoiceQuestion',
    translationName: 'component.questions.single_choice_question',
    descriptionType: 'component.question_type.description.SingleChoiceQuestion',
  },
  {
    id: 'YesNoSingleChoiceQuestion',
    translationName: 'component.questions.single_choice_question_yes_no',
    descriptionType: 'component.question_type.description.YesNoSingleChoiceQuestion',
  },
  {
    id: 'TrueFalseSingleChoiceQuestion',
    translationName: 'component.questions.single_choice_question_true_false',
    descriptionType: 'component.question_type.description.TrueFalseSingleChoiceQuestion',
  },
  {
    id: 'RangedQuestion',
    translationName: 'component.questions.ranged_question',
    descriptionType: 'component.question_type.description.RangedQuestion',
  },
  {
    id: 'FreeTextQuestion',
    translationName: 'component.questions.free_text_question',
    descriptionType: 'component.question_type.description.FreeTextQuestion',
  },
  {
    id: 'SurveyQuestion',
    translationName: 'component.questions.survey_question',
    descriptionType: 'component.question_type.description.SurveyQuestion',
  },
];
