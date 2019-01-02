import { IMessage } from '../../../lib/interfaces/communication/IMessage';

export class ConnectionMockService {

  public socket = {
    subscribe: () => {},
  };

  constructor() {
    this.initWebsocket();
  }

  public cleanUp(): void {

  }

  public sendMessage(message: IMessage): void {

  }

  public authorizeWebSocket(name: string): void {

  }

  public authorizeWebSocketAsOwner(name: string): void {

  }

  public initConnection(overrideCurrentState?: boolean): Promise<any> {
    return new Promise<any>((resolve) => resolve({
      serverConfig: {},
    }));
  }

  public calculateConnectionSpeedIndicator(): void {

  }

  public calculateRTT(): void {

  }

  private initWebsocket(): void {

  }

  private sendAuthorizationMessage(name: string, step: string, auth: string): void {

  }
}
