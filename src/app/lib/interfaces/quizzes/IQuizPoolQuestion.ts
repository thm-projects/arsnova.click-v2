import { AbstractQuestionEntity } from '../../entities/question/AbstractQuestionEntity';
import { QuizEntity } from '../../entities/QuizEntity';

export interface IQuizPoolQuestion {
  id: string;
  approved: boolean;
  question: AbstractQuestionEntity;
  createdAt: string;
  updatedAt: string;
}
