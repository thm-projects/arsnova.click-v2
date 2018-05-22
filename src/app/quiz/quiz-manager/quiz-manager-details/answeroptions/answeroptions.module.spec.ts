import { AnsweroptionsModule } from './answeroptions.module';

describe('AnsweroptionsModule', () => {
  let answeroptionsModule: AnsweroptionsModule;

  beforeEach(() => {
    answeroptionsModule = new AnsweroptionsModule();
  });

  it('should create an instance', () => {
    expect(answeroptionsModule).toBeTruthy();
  });
});
