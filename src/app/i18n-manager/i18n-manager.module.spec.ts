import { I18nManagerModule } from './i18n-manager.module';

describe('I18nManagerModule', () => {
  let i18nManagerModule: I18nManagerModule;

  beforeEach(() => {
    i18nManagerModule = new I18nManagerModule();
  });

  it('should create an instance', () => {
    expect(i18nManagerModule).toBeTruthy();
  });
});
