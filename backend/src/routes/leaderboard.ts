import {Router, Request, Response, NextFunction} from 'express';
import QuizManagerDAO from '../db/quiz-manager';
import {IQuestion} from '../interfaces/questions/interfaces';
import {IActiveQuiz} from '../interfaces/common.interfaces';
import {Leaderboard} from '../leaderboard/leaderboard';

export class LeaderboardRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;
  private _leaderboard: Leaderboard = new Leaderboard();

  /**
   * Initialize the LeaderboardRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  private getLeaderBoardData(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManagerDAO.getActiveQuizByName(req.params.quizName);
    const index: number = +req.params.questionIndex;
    const questionAmount: number = activeQuiz.originalObject.questionList.length;
    const questionIndex: number = isNaN(index) ? 0 : index;
    const endIndex: number = isNaN(index) || index < 0 || index > questionAmount ? questionAmount : index + 1;
    const correctResponses: any = {};
    const partiallyCorrectResponses: any = {};
    console.log('leaderboard starting with index', questionIndex, 'ending with index', endIndex);
    activeQuiz.nicknames.forEach(attendee => {
      for (let i: number = questionIndex; i < endIndex; i++) {
        const question: IQuestion = activeQuiz.originalObject.questionList[i];
        if (['SurveyQuestion', 'ABCDSingleChoiceQuestion'].indexOf(question.TYPE) > -1) {
          continue;
        }
        const isCorrect = this._leaderboard.isCorrectResponse(attendee.responses[i], question);
        console.log('leaderboard correct value is', isCorrect, 'for question index', i);
        if (isCorrect === 1) {
          if (!correctResponses[attendee.name]) {
            correctResponses[attendee.name] = {responseTime: 0};
          }
          correctResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
        } else if (isCorrect === 0) {
          if (!partiallyCorrectResponses[attendee.name]) {
            partiallyCorrectResponses[attendee.name] = {responseTime: 0};
          }
          partiallyCorrectResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
        } else {
          delete correctResponses[attendee.name];
          delete partiallyCorrectResponses[attendee.name];
          break;
        }
      }
    });
    console.log('leaderboard before converting object to array', correctResponses, partiallyCorrectResponses);
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
    this._router.get('/:quizName/:questionIndex?', this.getLeaderBoardData.bind(this));
  }
}

// Create the ApiRouter, and export its configured Express.Router
const leaderboardRoutes: LeaderboardRouter = new LeaderboardRouter();

export default leaderboardRoutes.router;
