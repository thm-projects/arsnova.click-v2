import { LivePreviewModule } from './live-preview.module';

describe('LivePreviewModule', () => {
  let livePreviewModule: LivePreviewModule;

  beforeEach(() => {
    livePreviewModule = new LivePreviewModule();
  });

  it('should create an instance', () => {
    expect(livePreviewModule).toBeTruthy();
  });
});
