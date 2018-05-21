import { RootModule } from './root.module';

describe('RootModule', () => {
  let rootModule: RootModule;

  beforeEach(() => {
    rootModule = new RootModule();
  });

  it('should create an instance', () => {
    expect(rootModule).toBeTruthy();
  });
});
