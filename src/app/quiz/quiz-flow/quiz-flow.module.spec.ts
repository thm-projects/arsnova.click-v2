import { QuizFlowModule } from './quiz-flow.module';

describe('QuizFlowModule', () => {
  let quizFlowModule: QuizFlowModule;

  beforeEach(() => {
    quizFlowModule = new QuizFlowModule();
  });

  it('should create an instance', () => {
    expect(quizFlowModule).toBeTruthy();
  });
});
