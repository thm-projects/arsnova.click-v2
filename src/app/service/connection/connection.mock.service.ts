import { IMessage } from 'arsnova-click-v2-types/dist/common';


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

  public authorizeWebSocket(hashtag: string): void {

  }

  public authorizeWebSocketAsOwner(hashtag: string): void {

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

  private sendAuthorizationMessage(hashtag: string, step: string, auth: string): void {

  }
}
