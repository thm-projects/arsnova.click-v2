import { MarkdownBarModule } from './markdown-bar.module';

describe('MarkdownModule', () => {
  let markdownModule: MarkdownBarModule;

  beforeEach(() => {
    markdownModule = new MarkdownBarModule();
  });

  it('should create an instance', () => {
    expect(markdownModule).toBeTruthy();
  });
});
