import { QuizEntity } from '../../app/lib/entities/QuizEntity';
import { QuizState } from '../../app/lib/enums/QuizState';
import { QuizVisibility } from '../../app/lib/enums/QuizVisibility';

export const QuizMock: QuizEntity = new QuizEntity({
  currentQuestionIndex: 0,
  currentStartTimestamp: 0,
  description: '',
  expiry: undefined,
  memberGroups: undefined,
  questionList: undefined,
  sessionConfig: undefined,
  state: QuizState.Active,
  visibility: QuizVisibility.Account,
  name: 'quiz-test',
});
