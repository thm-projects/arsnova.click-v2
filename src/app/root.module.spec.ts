import { RootModule } from './root.module';

describe('RootModule', () => {
  let RootModuleModule: RootModule;

  beforeEach(() => {
    RootModuleModule = new RootModule(null, null);
  });

  it('should create an instance', () => {
    expect(RootModuleModule).toBeTruthy();
  });
});
