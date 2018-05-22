import { QuizModule } from './quiz.module';

describe('QuizModule', () => {
  let quizModule: QuizModule;

  beforeEach(() => {
    quizModule = new QuizModule();
  });

  it('should create an instance', () => {
    expect(quizModule).toBeTruthy();
  });
});
