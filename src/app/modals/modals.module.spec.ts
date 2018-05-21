import { ModalsModule } from './modals.module';

describe('ModalsModule', () => {
  let modalsModule: ModalsModule;

  beforeEach(() => {
    modalsModule = new ModalsModule();
  });

  it('should create an instance', () => {
    expect(modalsModule).toBeTruthy();
  });
});
