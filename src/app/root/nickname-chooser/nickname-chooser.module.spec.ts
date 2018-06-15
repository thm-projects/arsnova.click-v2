import { NicknameChooserModule } from './nickname-chooser.module';

describe('NicknameChooserModule', () => {
  let nicknameChooserModule: NicknameChooserModule;

  beforeEach(() => {
    nicknameChooserModule = new NicknameChooserModule();
  });

  it('should create an instance', () => {
    expect(nicknameChooserModule).toBeTruthy();
  });
});
