import { QuizManagerModule } from './quiz-manager.module';

describe('QuizManagerModule', () => {
  let quizManagerModule: QuizManagerModule;

  beforeEach(() => {
    quizManagerModule = new QuizManagerModule();
  });

  it('should create an instance', () => {
    expect(quizManagerModule).toBeTruthy();
  });
});
