import { QuizResultsModule } from './quiz-results.module';

describe('QuizResultsModule', () => {
  let quizResultsModule: QuizResultsModule;

  beforeEach(() => {
    quizResultsModule = new QuizResultsModule();
  });

  it('should create an instance', () => {
    expect(quizResultsModule).toBeTruthy();
  });
});
