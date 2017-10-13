import {Router, Request, Response, NextFunction} from 'express';
import QuizManager from '../db/quiz-manager';
import * as fs from 'fs';
import * as path from 'path';
import {IQuestionGroup} from '../interfaces/questions/interfaces';
import {ISessionConfiguration} from '../interfaces/session_configuration/interfaces';
import availableNicks from '../nicknames/availableNicks';
import {themes} from '../themes/availableThemes';
import {IActiveQuiz, INickname, IQuizResponse} from '../interfaces/common.interfaces';

export class ApiRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the ApiRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  /**
   * GET all Data.
   * TODO: Return REST Spec here
   */
  public getAll(req: Request, res: Response, next: NextFunction): void {
    res.send({ab: 'cd'});
  }

  public getThemes(req: Request, res: Response, next: NextFunction): void {
    res.send({
      status: 'STATUS:SUCCESSFULL',
      step: 'GET_THEMES',
      payload: themes
    });
  }

  public getTheme(req: Request, res: Response, next: NextFunction): void {
    res.send(fs.readFileSync(path.join(__dirname, `../../theme_preview/${req.params.themeId}_${req.params.languageId}.png`)));
  }

  public getIsAvailableQuiz(req: Request, res: Response, next: NextFunction): void {
    const quizzes: Array<string> = Object.keys(QuizManager.getAllActiveQuizzes()).map((value: string) => {
      return QuizManager.getAllActiveQuizzes()[value].name.toLowerCase();
    });
    const quizExists: boolean = quizzes.indexOf(req.params.quizName) > -1;
    const payload: { available?: boolean, provideNickSelection?: boolean } = {};

    if (quizExists) {
      const sessionConfig: ISessionConfiguration = QuizManager.getActiveQuizByName(req.params.quizName).originalObject.sessionConfig;
      const provideNickSelection: boolean = sessionConfig.nicks.selectedNicks.length > 0;

      payload.available = true;
      payload.provideNickSelection = provideNickSelection;
    }

    const result: Object = {
      status: `STATUS:${quizExists ? 'SUCCESS' : 'FAILED'}`,
      step: `QUIZ:${!quizExists ? 'UN' : ''}AVAILABLE`,
      payload
    };
    res.send(result);
  }

  public generateDemoQuiz(req: Request, res: Response, next: NextFunction): void {
    try {
      const result: IQuestionGroup = JSON.parse(fs.readFileSync(path.join(__dirname, '../../demo_quiz/de.demo_quiz.json')).toString());
      result.hashtag = 'Demo Quiz ' + (QuizManager.getAllActiveDemoQuizzes().length + 1);
      QuizManager.convertLegacyQuiz(result);
      res.setHeader('Response-Type', 'text/plain');
      res.send(result);
    } catch (ex) {
      res.send(`File IO Error: ${ex}`);
    }
  }

  public getAllAvailableNicks(req: Request, res: Response, next: NextFunction): void {
    res.send(availableNicks);
  }

  public putOpenLobby(req: Request, res: Response, next: NextFunction): void {
    QuizManager.initActiveQuiz(req.body.quiz);
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'LOBBY:OPENED',
      payload: req.body.quiz
    });
  }

  public putCloseLobby(req: Request, res: Response, next: NextFunction): void {
    const result: boolean = QuizManager.removeActiveQuiz(req.body.quizName);
    const response: Object = {status: `STATUS:${result ? 'SUCCESSFUL' : 'FAILED'}`};
    if (result) {
      Object.assign(response, {
        step: 'LOBBY:CLOSED',
        payload: {}
      });
    }
    res.send(response);
  }

  public addMember(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.body.quizName);
    try {
      const result: boolean = activeQuiz.addMember(req.body.nickname, parseInt(req.body.webSocketId, 10));
      res.send({
        status: 'STATUS:SUCCESSFUL',
        step: 'LOBBY:MEMBER_ADDED',
        payload: {
          currentQuestion: activeQuiz.originalObject.questionList[activeQuiz.currentQuestionIndex],
          member: activeQuiz.nicknames[activeQuiz.nicknames.length - 1].serialize(),
          nicknames: activeQuiz.nicknames.map((value: INickname) => {
            return value.serialize();
          })
        }
      });
    } catch (ex) {
      res.send({
        status: 'STATUS:FAILED',
        step: ex.message,
        payload: {}
      });
    }
  }

  public deleteMember(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.params.quizName);
    const result: boolean = activeQuiz.removeMember(req.params.nickname);
    const response: Object = {status: `STATUS:${result ? 'SUCCESSFUL' : 'FAILED'}`};
    if (result) {
      Object.assign(response, {
        step: 'LOBBY:MEMBER_REMOVED',
        payload: {}
      });
    }
    res.send(response);
  }

  public getAllMembers(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.params.quizName);
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_MEMBERS',
      payload: {
        nicknames: activeQuiz.nicknames.map((value: INickname) => {
          return value.serialize();
        })
      }
    });
  }

  public getRemainingNicks(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.params.quizName);
    const names: Array<String> = activeQuiz.originalObject.sessionConfig.nicks.selectedNicks.filter((nick) => {
      return activeQuiz.nicknames.filter(value => value.name === nick).length === 0;
    });
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_REMAINING_NICKS',
      payload: {nicknames: names}
    });
  }

  public addMemberResponse(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.body.quizName);
    if (activeQuiz.nicknames.filter(value => {
        return value.name === req.body.nickname;
      })[0].responses[+req.body.questionIndex]) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:DUPLICATE_MEMBER_RESPONSE',
        payload: {}
      });
      return;
    }

    if (typeof req.body.value === 'undefined' || !req.body.responseTime) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INVALID_MEMBER_RESPONSE',
        payload: {}
      });
      return;
    }

    activeQuiz.addResponse(req.body.nickname, +req.body.questionIndex, <IQuizResponse>{
      value: req.body.value,
      responseTime: parseInt(req.body.responseTime, 10),
      confidence: parseInt(req.body.confidence, 10) || 0,
      readingConfirmation: req.body.readingConfirmation || false
    });

    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:ADD_MEMBER_RESPONSE',
      payload: {}
    });
  }

  public randomFile(dir: string): Promise<string> {
    return new Promise((resolve) => {
      fs.readdir(dir, (err, items) => {
        resolve(items[Math.floor(Math.random() * items.length)]);
      });
    });
  }

  public getFileByName(req: Request, res: Response, next: NextFunction): void {
    const pathToFiles: string = path.join(__dirname, `../../${req.params.directory}/${req.params.subdirectory}`);
    if (req.params.fileName.indexOf('Random') > -1) {
      this.randomFile(pathToFiles).then((file: string) => {
        res.send(fs.readFileSync(file));
      });
    } else {
      res.send(fs.readFileSync(`${pathToFiles}/${req.params.fileName}`));
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init(): void {
    this._router.get('/', this.getAll);

    this._router.get('/themes', this.getThemes);
    this._router.get('/theme/:themeId/:languageId', this.getTheme);

    this._router.get('/getAvailableQuiz/:quizName', this.getIsAvailableQuiz);

    this._router.get('/demoquiz/generate', this.generateDemoQuiz);

    this._router.get('/availableNicks/all', this.getAllAvailableNicks);

    this._router.put('/lobby', this.putOpenLobby);
    this._router.delete('/lobby', this.putCloseLobby);

    this._router.put('/lobby/member', this.addMember);
    this._router.delete('/lobby/:quizName/member/:nickname', this.deleteMember);

    this._router.get('/quiz/member/:quizName', this.getAllMembers);
    this._router.get('/quiz/member/:quizName/available', this.getRemainingNicks);

    this._router.put('/quiz/member/response', this.addMemberResponse);

    this._router.get('/files/:directory/:subdirectory/:fileName', this.getFileByName);
  }

}

// Create the ApiRouter, and export its configured Express.Router
const apiRoutes: ApiRouter = new ApiRouter();

export default apiRoutes.router;
