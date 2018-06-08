import { InfoModule } from './info.module';

describe('InfoModule', () => {
  let infoModule: InfoModule;

  beforeEach(() => {
    infoModule = new InfoModule();
  });

  it('should create an instance', () => {
    expect(infoModule).toBeTruthy();
  });
});
