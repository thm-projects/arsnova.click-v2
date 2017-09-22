import * as WebSocket from 'ws';
import {IActiveQuiz, default as QuizManagerDAO, INickname} from '../db/quiz-manager';

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
        client.send(JSON.stringify(message));
      }
    });
  }

  private init(): void {
    WebSocketRouter.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string | any) => {
        console.log('received: %s', message);
        try {
          message = JSON.parse(message);
          console.log(this.activeQuizReference);
          if (message.step === 'LOBBY:GET_PLAYERS') {
            const res: any = {status: 'STATUS:SUCCESSFUL'};
            if (!this.activeQuizReference) {
              res.step = 'LOBBY:INACTIVE';
            } else {
              res.step = 'LOBBY:ALL_PLAYERS';
              res.payload = {
                members: this.activeQuizReference.nicknames.map((value: INickname) => {
                  return value.serialize();
                })
              };
            }
            ws.send(JSON.stringify(res));
          } else if (message.step === 'QUIZ:ACTIVE_QUIZZES') {
            ws.send(JSON.stringify({
              status: 'STATUS:SUCCESSFUL',
              step: 'QUIZ:ACTIVE_QUIZZES',
              payload: {
                activeQuizzes: QuizManagerDAO.getAllActiveDemoQuizzes()
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
