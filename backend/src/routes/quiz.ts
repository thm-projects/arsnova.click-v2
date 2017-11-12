import {Router, Request, Response, NextFunction} from 'express';
import QuizManagerDAO from '../db/quiz-manager';
import {IQuestion, IQuestionGroup} from '../interfaces/questions/interfaces';
import {IActiveQuiz} from '../interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from '../db/DbDao';
import {MatchTextToAssetsDb} from '../cache/assets';
import {IAnswerOption} from '../interfaces/answeroptions/interfaces';
import {ISessionConfiguration} from '../interfaces/session_configuration/interfaces';
import {ExcelWorkbook} from '../export/excel-workbook';
import {Leaderboard} from '../leaderboard/leaderboard';
import * as fs from 'fs';
import * as path from 'path';

const privateServerConfig = require('../../settings.json');
privateServerConfig.public.limitActiveQuizzes = parseFloat(privateServerConfig.public.limitActiveQuizzes);
const publicServerConfig = privateServerConfig.public;

export class QuizRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;
  private _leaderboard: Leaderboard = new Leaderboard();

  /**
   * Initialize the QuizRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  private getAll(req: Request, res: Response, next: NextFunction): void {
    res.json({});
  }


  public getIsAvailableQuiz(req: Request, res: Response): void {
    const quiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    const payload: { available?: boolean, provideNickSelection?: boolean, authorizeViaCas?: boolean } = {};

    const isInactive: boolean = QuizManagerDAO.isInactiveQuiz(req.params.quizName);

    if (quiz) {
      const sessionConfig: ISessionConfiguration = QuizManagerDAO.getActiveQuizByName(req.params.quizName).originalObject.sessionConfig;
      const provideNickSelection: boolean = sessionConfig.nicks.selectedNicks.length > 0;

      payload.available = true;
      payload.provideNickSelection = provideNickSelection;
      payload.authorizeViaCas = sessionConfig.nicks.restrictToCasLogin;
    }

    const result: Object = {
      status: `STATUS:SUCCESS`,
      step: `QUIZ:${quiz ? 'AVAILABLE' : isInactive ? 'EXISTS' : 'UNDEFINED'}`,
      payload
    };
    res.send(result);
  }

  public generateDemoQuiz(req: Request, res: Response): void {
    try {
      const basePath = path.join(__dirname, '..', '..', 'predefined_quizzes', 'demo_quiz');
      let demoQuizPath = path.join(basePath, `${req.params.languageId.toLowerCase()}.demo_quiz.json`);
      if (!fs.existsSync(demoQuizPath)) {
        demoQuizPath = path.join(basePath, 'en.demo_quiz.json');
      }
      const result: IQuestionGroup = JSON.parse(fs.readFileSync(demoQuizPath).toString());
      result.hashtag = 'Demo Quiz ' + (QuizManagerDAO.getAllPersistedDemoQuizzes().length + 1);
      QuizManagerDAO.convertLegacyQuiz(result);
      res.setHeader('Response-Type', 'application/json');
      res.send(result);
    } catch (ex) {
      res.send(`File IO Error: ${ex}`);
    }
  }

  public generateAbcdQuiz(req: Request, res: Response): void {
    try {
      const answerLength = req.params.answerLength || 4;
      const basePath = path.join(__dirname, '..', '..', 'predefined_quizzes', 'abcd_quiz');
      let abcdQuizPath = path.join(basePath, `${req.params.languageId.toLowerCase()}.abcd_quiz.json`);
      if (!fs.existsSync(abcdQuizPath)) {
        abcdQuizPath = path.join(basePath, 'en.abcd_quiz.json');
      }
      const result: IQuestionGroup = JSON.parse(fs.readFileSync(abcdQuizPath).toString());
      let abcdName = '';
      for (let i  = 0; i < answerLength; i++) {
        abcdName += String.fromCharCode(65 + i);
      }
      result.hashtag = `${abcdName} ${(QuizManagerDAO.getAllPersistedAbcdQuizzesByLength(answerLength).length + 1)}`;
      QuizManagerDAO.convertLegacyQuiz(result);
      res.setHeader('Response-Type', 'application/json');
      res.send(result);
    } catch (ex) {
      res.send(`File IO Error: ${ex}`);
    }
  }

  public uploadQuiz(req: UploadRequest, res: Response): void {
    const duplicateQuizzes = [];
    const quizData = [];
    let privateKey = '';
    if (req.busboy) {
      const promise = new Promise((resolve) => {
        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          if (fieldname === 'uploadFiles[]') {
            let quiz = '';
            file.on('data', (buffer) => {
              quiz += buffer.toString('utf8');
            });
            file.on('end', () => {
              quizData.push({
                fileName: filename,
                quiz: JSON.parse(quiz)
              });
            });
          }
        });
        req.busboy.on('field', function(key, value) {
          if (key === 'privateKey') {
            privateKey = value;
          }
        });
        req.busboy.on('finish', function() {
          resolve();
        });
        req.pipe(req.busboy);
      });
      promise.then(() => {
        quizData.forEach((data: {fileName: string, quiz: IQuestionGroup}) => {
          const dbResult = DbDao.read(DatabaseTypes.quiz, {quizName: data.quiz.hashtag});
          if (dbResult) {
            duplicateQuizzes.push({
              quizName: data.quiz.hashtag,
              fileName: data.fileName,
              renameRecommendation: QuizManagerDAO.getRenameRecommendations(data.quiz.hashtag)
            });
          } else {
            DbDao.create(DatabaseTypes.quiz, {quizName: data.quiz.hashtag, privateKey});
            QuizManagerDAO.initInactiveQuiz(data.quiz.hashtag);
            if (publicServerConfig.cacheQuizAssets) {
              const quiz: IQuestionGroup = data.quiz;
              quiz.questionList.forEach((question: IQuestion) => {
                MatchTextToAssetsDb(question.questionText);
                question.answerOptionList.forEach((answerOption: IAnswerOption) => {
                  MatchTextToAssetsDb(answerOption.answerText);
                });
              });
            }
          }
        });
        res.send({status: 'STATUS:SUCCESSFUL', step: 'QUIZ:UPLOAD_FILE', payload: {duplicateQuizzes}});
      });
    } else {
      res.send({status: 'STATUS:FAILED', step: 'QUIZ:UPLOAD_FILE', payload: {message: 'busboy not found'}});
    }
  }

  public startQuiz(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.body.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:START:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    if (activeQuiz.currentStartTimestamp) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:ALREADY_STARTED',
        payload: {startTimestamp: activeQuiz.currentStartTimestamp, nextQuestionIndex: activeQuiz.currentQuestionIndex}
      });
    } else {
      const nextQuestionIndex = activeQuiz.originalObject.sessionConfig.readingConfirmationEnabled ?
        activeQuiz.currentQuestionIndex :
        activeQuiz.nextQuestion();

      if (nextQuestionIndex === -1) {
        res.send({
          status: 'STATUS:FAILED',
          step: 'QUIZ:END_OF_QUESTIONS',
          payload: {}
        });
      } else {
        const startTimestamp: number = new Date().getTime();
        activeQuiz.setTimestamp(startTimestamp);
        res.send({
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:START',
          payload: {startTimestamp, nextQuestionIndex}
        });
      }
    }
  }

  public stopQuiz(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.body.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:STOP:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    activeQuiz.stop();
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:STOP',
      payload: {}
    });
  }

  public getCurrentQuizState(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:CURRENT_STATE:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    const index = activeQuiz.currentQuestionIndex < 0 ? 0 : activeQuiz.currentQuestionIndex;
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:CURRENT_STATE',
      payload: {
        questions: activeQuiz.originalObject.questionList.slice(0, index + 1),
        questionIndex: index,
        startTimestamp: activeQuiz.currentStartTimestamp,
        numberOfQuestions: activeQuiz.originalObject.questionList.length
      }
    });
  }

  public showReadingConfirmation(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.body.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:READING_CONFIRMATION_REQUESTED:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    activeQuiz.nextQuestion();
    activeQuiz.requestReadingConfirmation();
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:READING_CONFIRMATION_REQUESTED',
      payload: {}
    });
  }

  public getQuizStartTime(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:GET_STARTTIME:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_STARTTIME',
      payload: {startTimestamp: activeQuiz.currentStartTimestamp}
    });
  }

  public getQuizSettings(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:SETTINGS:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:SETTINGS',
      payload: {settings: activeQuiz.originalObject.sessionConfig}
    });
  }

  public updateQuizSettings(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.body.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:UPDATED_SETTINGS:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    activeQuiz.updateQuizSettings(req.body.target, req.body.state);
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:UPDATED_SETTINGS',
      payload: {}
    });
  }

  public reserveQuiz(req: Request, res: Response): void {
    if (!req.body.quizName || !req.body.privateKey) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INVALID_DATA',
        payload: {}
      }));
      return;
    }
    const activeQuizzesAmount = QuizManagerDAO.getAllActiveQuizNames();
    if (activeQuizzesAmount.length >= publicServerConfig.limitActiveQuizzes) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:TOO_MUCH_ACTIVE_QUIZZES',
        payload: {
          activeQuizzes: activeQuizzesAmount,
          limitActiveQuizzes: publicServerConfig.limitActiveQuizzes
        }
      });
      return;
    }
    if (publicServerConfig.createQuizPasswordRequired && !req.body.serverPassword) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:SERVER_PASSWORD_REQUIRED',
        payload: {}
      });
      return;
    }
    if (req.body.serverPassword !== privateServerConfig.createQuizPassword) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INSUFFICIENT_PERMISSIONS',
        payload: {}
      }));
      return;
    }
    QuizManagerDAO.initInactiveQuiz(req.body.quizName);
    DbDao.create(DatabaseTypes.quiz, {quizName: req.body.quizName, privateKey: req.body.privateKey});
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:RESERVED',
      payload: {}
    });
  }

  public deleteQuiz(req: Request, res: Response): void {
    if (!req.body.quizName || !req.body.privateKey) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INVALID_DATA',
        payload: {}
      }));
      return;
    }
    const dbResult: boolean = DbDao.delete(DatabaseTypes.quiz, {quizName: req.body.quizName, privateKey: req.body.privateKey});
    if (dbResult) {
      QuizManagerDAO.removeQuiz(req.body.quizName);
      res.send({
        status: 'STATUS:SUCCESS',
        step: 'QUIZ:REMOVED',
        payload: {}
      });
    } else {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INSUFFICIENT_PERMISSIONS',
        payload: {}
      }));
    }
  }

  public deleteActiveQuiz(req: Request, res: Response): void {
    if (!req.body.quizName || !req.body.privateKey) {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INVALID_DATA',
        payload: {}
      });
      return;
    }
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.body.quizName);
    const dbResult: Object = DbDao.read(DatabaseTypes.quiz, {quizName: req.body.quizName, privateKey: req.body.privateKey});
    if (activeQuiz && dbResult) {
      activeQuiz.onDestroy();
      QuizManagerDAO.setQuizAsInactive(req.body.quizName);
      res.send({
        status: 'STATUS:SUCCESS',
        step: 'QUIZ:CLOSED',
        payload: {}
      });
    } else {
      res.send({
        status: 'STATUS:FAILED',
        step: 'QUIZ:INSUFFICIENT_PERMISSIONS',
        payload: {}
      });
    }
  }

  public resetQuiz(req: Request, res: Response): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'QUIZ:RESET:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    activeQuiz.reset();
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:RESET',
      payload: {}
    });
  }

  public getExportFile(req: Request, res: I18nResponse): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    const dbResult: Object = DbDao.read(DatabaseTypes.quiz, {quizName: req.params.quizName, privateKey: req.params.privateKey});

    if (!dbResult) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'EXPORT:QUIZ_NOT_FOUND',
        payload: {}
      }));
      return;
    }
    if (!activeQuiz) {
      res.sendStatus(500);
      res.end(JSON.stringify({
        status: 'STATUS:FAILED',
        step: 'EXPORT:QUIZ_INACTIVE',
        payload: {}
      }));
      return;
    }
    const wb = new ExcelWorkbook({
      themeName: req.params.theme,
      translation: req.params.language,
      quiz: activeQuiz,
      mf: res.__mf
    });
    const date: Date = new Date();
    const dateFormatted = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}-${date.getHours()}_${date.getMinutes()}`;
    wb.write(`Export-${req.params.quizName}-${dateFormatted}.xlsx`, res);
  }

  private getLeaderBoardData(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    const index: number = +req.params.questionIndex;
    const questionAmount: number = activeQuiz.originalObject.questionList.length;
    const questionIndex: number = isNaN(index) ? 0 : index;
    const endIndex: number = isNaN(index) || index < 0 || index > questionAmount ? questionAmount : index + 1;
    const correctResponses: any = {};
    const partiallyCorrectResponses: any = {};
    activeQuiz.nicknames.forEach(attendee => {
      for (let i: number = questionIndex; i < endIndex; i++) {
        const question: IQuestion = activeQuiz.originalObject.questionList[i];
        if (['SurveyQuestion', 'ABCDSingleChoiceQuestion'].indexOf(question.TYPE) > -1) {
          continue;
        }
        const isCorrect = this._leaderboard.isCorrectResponse(attendee.responses[i], question);
        if (isCorrect === 1) {
          if (!correctResponses[attendee.name]) {
            correctResponses[attendee.name] = {responseTime: 0, correctQuestions: [], confidenceValue: 0};
          }
          correctResponses[attendee.name].correctQuestions.push(i);
          correctResponses[attendee.name].confidenceValue += <number>attendee.responses[i].confidence;
          correctResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
        } else if (isCorrect === 0) {
          if (!partiallyCorrectResponses[attendee.name]) {
            partiallyCorrectResponses[attendee.name] = {responseTime: 0, correctQuestions: [], confidenceValue: 0};
          }
          partiallyCorrectResponses[attendee.name].correctQuestions.push(i);
          partiallyCorrectResponses[attendee.name].confidenceValue += <number>attendee.responses[i].confidence;
          partiallyCorrectResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
        } else {
          delete correctResponses[attendee.name];
          delete partiallyCorrectResponses[attendee.name];
          break;
        }
      }
    });
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_LEADERBOARD_DATA',
      payload: {
        correctResponses: this._leaderboard.objectToArray(correctResponses),
        partiallyCorrectResponses: this._leaderboard.objectToArray(partiallyCorrectResponses),
      }
    });
  }

  public init(): void {
    this._router.get('/', this.getAll);

    this._router.get('/generate/demo/:languageId', this.generateDemoQuiz);
    this._router.get('/generate/abcd/:languageId/:answerLength?', this.generateAbcdQuiz);
    this._router.get('/status/:quizName', this.getIsAvailableQuiz);
    this._router.get('/currentState/:quizName', this.getCurrentQuizState);
    this._router.get('/startTime/:quizName', this.getQuizStartTime);
    this._router.get('/settings/:quizName', this.getQuizSettings);
    this._router.get('/export/:quizName/:privateKey/:theme/:language', this.getExportFile);
    this._router.get('/leaderboard/:quizName/:questionIndex?', this.getLeaderBoardData.bind(this));

    this._router.post('/upload', this.uploadQuiz);
    this._router.post('/start', this.startQuiz);
    this._router.post('/stop', this.stopQuiz);
    this._router.post('/reading-confirmation', this.showReadingConfirmation);
    this._router.post('/settings/update', this.updateQuizSettings);
    this._router.post('/reserve', this.reserveQuiz);

    this._router.patch('/reset/:quizName', this.resetQuiz);

    this._router.delete('/', this.deleteQuiz);
    this._router.delete('/active', this.deleteActiveQuiz);
  }
}

// Create the ApiRouter, and export its configured Express.Router
const quizRoutes: QuizRouter = new QuizRouter();

export default quizRoutes.router;
