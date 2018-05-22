import { QuizManagerDetailsModule } from './quiz-manager-details.module';

describe('QuizManagerDetailsModule', () => {
  let quizManagerDetailsModule: QuizManagerDetailsModule;

  beforeEach(() => {
    quizManagerDetailsModule = new QuizManagerDetailsModule();
  });

  it('should create an instance', () => {
    expect(quizManagerDetailsModule).toBeTruthy();
  });
});
