import * as WebSocket from 'ws';
import {IActiveQuiz} from '../db/quiz-manager';

export declare interface IMessage {
  status: string;
  step: string;
  payload: any;
}

export class WebSocketRouter {
  public static wss: WebSocket.Server;
  private clientList: Array<WebSocket> = [];
  private activeQuizReference: IActiveQuiz;

  constructor(activeQuizReference: IActiveQuiz) {
    this.init();
    this.activeQuizReference = activeQuizReference;
  }

  public pushMessageToClients(message: IMessage): void {
    this.clientList.forEach((client: WebSocket) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }

  private init(): void {
    WebSocketRouter.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string | any) => {
        console.log('received: %s', message);
        try {
          message = JSON.parse(message);
          console.log(message.step);
          if (message.step === 'LOBBY:GET_PLAYERS') {
            ws.send(JSON.stringify({
              status: 'STATUS:SUCCESSFUL',
              step: 'LOBBY:ALL_PLAYERS',
              payload: {
                members: this.activeQuizReference.nicknames
              }
            }));
          }
        } catch (ex) {
          ws.send(`Hello, you sent -> ${message}`);
        }
      });
      const id: number = this.clientList.push(ws);
      ws.send(JSON.stringify({
        id: id - 1
      }));
    });
  }
}
