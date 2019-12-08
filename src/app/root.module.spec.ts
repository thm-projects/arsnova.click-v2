import { environment } from '../environments/environment';
import { RootModule } from './root.module';

describe('RootModule', () => {
  let rootModule: RootModule;

  it('should create an instance', () => {
    rootModule = new RootModule();
    expect(rootModule).toBeTruthy();
  });

  it('should create an prod instance', () => {
    environment.production = true;
    rootModule = new RootModule();
    expect(rootModule).toBeTruthy();
  });
});
