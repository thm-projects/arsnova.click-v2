import { QuizState } from '../../lib/enums/QuizState';
import { QuizVisibility } from '../../lib/enums/QuizVisibility';
import { IAdminQuiz } from '../../lib/interfaces/quizzes/IAdminQuiz';
import { QuizAdminFilterPipe } from './quiz-admin-filter.pipe';

describe('QuizAdminFilterPipe', () => {
  const adminQuizzes: Array<IAdminQuiz> = [
    {
      state: QuizState.Inactive,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'test-quiz-inactive-1',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    }, {
      state: QuizState.Inactive,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'demo quiz 1',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    }, {
      state: QuizState.Inactive,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'abcd 1',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    }, {
      state: QuizState.Inactive,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'find-me',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    }, {
      state: QuizState.Running,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'test-quiz-running-1',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    }, {
      state: QuizState.Active,
      answerAmount: 1,
      expiry: null,
      id: null,
      memberAmount: 1,
      name: 'test-quiz-active-1',
      questionAmount: 1,
      visibility: QuizVisibility.Account,
    },
  ];

  it('create an instance', () => {
    const pipe = new QuizAdminFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should find the regular quizzes plus the demo quizzes in the values', () => {
    const pipe = new QuizAdminFilterPipe();
    const result = pipe.transform(adminQuizzes, { filterDemoQuiz: true });
    expect(result.length).toEqual(5);
    expect(result).toContain(adminQuizzes[1]);
  });

  it('should find the regular quizzes plus the abcd quizzes in the values', () => {
    const pipe = new QuizAdminFilterPipe();
    const result = pipe.transform(adminQuizzes, { filterAbcdQuiz: true });
    expect(result.length).toEqual(5);
    expect(result).toContain(adminQuizzes[2]);
  });

  it('should return the original values if no args are provided', () => {
    const pipe = new QuizAdminFilterPipe();
    expect(pipe.transform(adminQuizzes, {})).toEqual(adminQuizzes);
  });

  it('should find a quiz by case insensitive name', () => {
    const pipe = new QuizAdminFilterPipe();
    expect(pipe.transform(adminQuizzes, { filterQuizName: 'FIND-me' }).length).toEqual(1);
  });

  it('should find a running or active quiz in the values', () => {
    const pipe = new QuizAdminFilterPipe();
    expect(pipe.transform(adminQuizzes, { filterActiveQuiz: true }).length).toEqual(2);
  });
});
