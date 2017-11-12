import {Router, Request, Response, NextFunction} from 'express';
import QuizManagerDAO from '../db/quiz-manager';
import * as crypto from 'crypto';
import {DatabaseTypes, DbDao} from '../db/DbDao';
import {IQuestionGroup} from '../interfaces/questions/interfaces';

export class LegacyApiRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the LegacyApiRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  private getAll(req: Request, res: Response, next: NextFunction): void {
    res.json({});
  }

  private setKeepalive(req: Request, res: Response, next: NextFunction): void {
    res.send('Ok');
  }

  private addHashtag(req: Request, res: Response, next: NextFunction): void {
    const sessionConfiguration = req.body.sessionConfiguration;
    if (QuizManagerDAO.getPersistedQuizByName(sessionConfiguration.hashtag)) {
      res.sendStatus(500);
      res.end('Hashtag already in use');
      return;
    }
    QuizManagerDAO.initInactiveQuiz(sessionConfiguration.hashtag, sessionConfiguration.privateKey);
    DbDao.create(DatabaseTypes.quiz, {quizName: sessionConfiguration.hashtag, privateKey: sessionConfiguration.privateKey});
    res.send('Hashtag successfully created');
  }

  private dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }

  private createPrivateKey(req: Request, res: Response, next: NextFunction): void {
    const privateKey = crypto.randomBytes(Math.ceil((40) / 2))
                      .toString('hex')
                      .slice(0, 40);
    res.send(privateKey);
  }

  private removeLocalData(req: Request, res: Response, next: NextFunction): void {
    const sessionConfiguration = req.body.sessionConfiguration;
    if (!QuizManagerDAO.isActiveQuiz(sessionConfiguration.hashtag)) {
      res.sendStatus(500);
      res.end('Missing permissions.');
      return;
    }
    QuizManagerDAO.setQuizAsInactive(sessionConfiguration.hashtag);
    res.send('Session successfully removed');
  }

  private showReadingConfirmation(req: Request, res: Response, next: NextFunction): void {
    const sessionConfiguration = req.body.sessionConfiguration;
    const activeQuiz = QuizManagerDAO.getActiveQuizByName(sessionConfiguration.hashtag);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end('Hashtag not found');
      return;
    }
    activeQuiz.requestReadingConfirmation();
    res.sendStatus(200);
    res.end();
  }

  private openSession(req: Request, res: Response, next: NextFunction): void {
    const sessionConfiguration = req.body.sessionConfiguration;

    res.sendStatus(200);
    res.end();
    // TODO: Figure out how to combine req with /updateQuestionGroup request.
  }

  private startNextQuestion(req: Request, res: Response, next: NextFunction): void {
    const sessionConfiguration = req.body.sessionConfiguration;
    const activeQuiz = QuizManagerDAO.getActiveQuizByName(sessionConfiguration.hashtag);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end('Hashtag not found');
      return;
    }
    activeQuiz.nextQuestion();
    res.send(`Next Question with index ${sessionConfiguration.questionIndex} started.`);
  }

  private updateQuestionGroup(req: Request, res: Response, next: NextFunction): void {
    const questionGroup = <IQuestionGroup>req.body.questionGroupModel;
    if (!QuizManagerDAO.isInactiveQuiz(questionGroup.hashtag)) {
      res.sendStatus(500);
      res.end('Hashtag not found');
      return;
    }
    QuizManagerDAO.initActiveQuiz(questionGroup);
    res.send(`Session with hashtag ${questionGroup.hashtag} successfully updated`);
  }

  public init(): void {
    this._router.get('/', this.getAll);
    this._router.post('/keepalive', this.setKeepalive);
    this._router.post('/addHashtag', this.addHashtag);
    this._router.get('/createPrivateKey', this.createPrivateKey);
    this._router.post('/removeLocalData', this.removeLocalData);
    this._router.post('/showReadingConfirmation', this.showReadingConfirmation);
    this._router.post('/openSession', this.openSession);
    this._router.post('/startNextQuestion', this.startNextQuestion);
    this._router.post('/updateQuestionGroup', this.updateQuestionGroup);
  }
}

// Create the LegacyApiRouter, and export its configured Express.Router
const legacyApiRoutes: LegacyApiRouter = new LegacyApiRouter();

export default legacyApiRoutes.router;
