import { RxStompService } from '@stomp/ng2-stompjs';
import { environment } from '../environments/environment';
import { AppModule } from './app.module';

describe('RootModule', () => {
  let rootModule: AppModule;

  it('should create an instance', () => {
    const stompService = new RxStompService();
    rootModule = new AppModule({}, stompService);
    expect(rootModule).toBeTruthy();
  });

  it('should create an prod instance', () => {
    const stompService = new RxStompService();
    environment.production = true;
    rootModule = new AppModule({}, stompService);
    expect(rootModule).toBeTruthy();
  });
});
