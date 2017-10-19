import * as WebSocket from 'ws';
import QuizManagerDAO from '../db/quiz-manager';
import {IActiveQuiz, INickname} from '../interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from '../db/DbDao';

export declare interface IMessage {
  status: string;
  step: string;
  payload: any;
}

export class WebSocketRouter {
  public static wss: WebSocket.Server;

  constructor() {
    this.init();
  }

  private init(): void {
    WebSocketRouter.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string | any) => {
        try {
          message = JSON.parse(message);

          console.log(`received message step ${message.step} with content ${message.payload}`);

          if (message.step === 'WEBSOCKET:AUTHORIZE') {
            const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(message.payload.quizName);
            activeQuiz.nicknames.forEach(nickname => {
              if (nickname.webSocketAuthorization === parseFloat(message.payload.webSocketAuthorization)) {
                nickname.webSocket = ws;
                ws.send(JSON.stringify({status: 'STATUS:SUCCESSFULL', step: 'WEBSOCKET:AUTHORIZED'}));
              }
            });
          }

          if (message.step === 'WEBSOCKET:AUTHORIZE_AS_OWNER') {
            const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(message.payload.quizName);
            const isOwner: Object = DbDao.read(DatabaseTypes.quiz, {
              quizName: message.payload.quizName,
              privateKey: message.payload.webSocketAuthorization
            });
            if (Object.keys(isOwner).length > 0) {
              activeQuiz.ownerSocket = ws;
              ws.send(JSON.stringify({status: 'STATUS:SUCCESSFULL', step: 'WEBSOCKET:AUTHORIZED'}));
            } else {
              ws.send(JSON.stringify({status: 'STATUS:FAILED', step: 'INSUFFICIENT_PERMISSIONS'}));
            }
          }

          if (message.step === 'LOBBY:GET_PLAYERS') {
            const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(message.payload.quizName);
            const res: any = {status: 'STATUS:SUCCESSFUL'};
            if (!activeQuiz) {
              res.step = 'LOBBY:INACTIVE';
            } else {
              res.step = 'LOBBY:ALL_PLAYERS';
              res.payload = {
                members: activeQuiz.nicknames.map((value: INickname) => {
                  return value.serialize();
                })
              };
            }
            ws.send(JSON.stringify(res));
          }

          if (message.step === 'QUIZ:ACTIVE_QUIZZES') {
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
    });
  }
}
