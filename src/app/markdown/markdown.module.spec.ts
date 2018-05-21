import { MarkdownModule } from './markdown.module';

describe('MarkdownModule', () => {
  let markdownModule: MarkdownModule;

  beforeEach(() => {
    markdownModule = new MarkdownModule();
  });

  it('should create an instance', () => {
    expect(markdownModule).toBeTruthy();
  });
});
