import { ABCDSingleChoiceQuestionEntity } from './entities/question/ABCDSingleChoiceQuestionEntity';
import { AbstractQuestionEntity } from './entities/question/AbstractQuestionEntity';
import { FreeTextQuestionEntity } from './entities/question/FreeTextQuestionEntity';
import { MultipleChoiceQuestionEntity } from './entities/question/MultipleChoiceQuestionEntity';
import { RangedQuestionEntity } from './entities/question/RangedQuestionEntity';
import { SingleChoiceQuestionEntity } from './entities/question/SingleChoiceQuestionEntity';
import { SurveyQuestionEntity } from './entities/question/SurveyQuestionEntity';
import { TrueFalseSingleChoiceQuestionEntity } from './entities/question/TrueFalseSingleChoiceQuestionEntity';
import { YesNoSingleChoiceQuestionEntity } from './entities/question/YesNoSingleChoiceQuestionEntity';
import { QuestionType } from './enums/QuestionType';

export const getQuestionForType = (type: QuestionType, data = {}): AbstractQuestionEntity => {
  switch (type) {
    case QuestionType.FreeTextQuestion:
      return new FreeTextQuestionEntity(data);
    case QuestionType.ABCDSingleChoiceQuestion:
      return new ABCDSingleChoiceQuestionEntity(data);
    case QuestionType.YesNoSingleChoiceQuestion:
      return new YesNoSingleChoiceQuestionEntity(data);
    case QuestionType.TrueFalseSingleChoiceQuestion:
      return new TrueFalseSingleChoiceQuestionEntity(data);
    case QuestionType.SingleChoiceQuestion:
      return new SingleChoiceQuestionEntity(data);
    case QuestionType.MultipleChoiceQuestion:
      return new MultipleChoiceQuestionEntity(data);
    case QuestionType.RangedQuestion:
      return new RangedQuestionEntity(data);
    case QuestionType.SurveyQuestion:
      return new SurveyQuestionEntity(data);
    default:
      throw new Error(`Cannot build question with type: ${type}`);
  }
};
