import {IMessage} from 'arsnova-click-v2-types/src/common';


export  class ConnectionMockService {

  public socket = {
    subscribe: () => {}
  };

  constructor() {
    this.initWebsocket();
  }

  private initWebsocket() {

  }

  cleanUp(): void {

  }

  public sendMessage(message: IMessage): void {

  }

  private sendAuthorizationMessage(hashtag: string, step: string, auth: string): void {

  }

  authorizeWebSocket(hashtag: string): void {

  }

  authorizeWebSocketAsOwner(hashtag: string): void {

  }

  initConnection(overrideCurrentState?: boolean): Promise<any> {
    return new Promise<any>((resolve) => resolve({
      serverConfig: {}
    }));
  }

  calculateConnectionSpeedIndicator() {

  }

  calculateRTT() {

  }
}
