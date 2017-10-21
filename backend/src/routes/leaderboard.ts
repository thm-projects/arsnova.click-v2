import {Router, Request, Response, NextFunction} from 'express';
import QuizManagerDAO from '../db/quiz-manager';
import {IQuestion, IQuestionChoice, IQuestionFreetext, IQuestionRanged} from '../interfaces/questions/interfaces';
import {IAnswerOption, IFreetextAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IActiveQuiz, IQuizResponse} from '../interfaces/common.interfaces';
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
    const questionIndex: number = req.params.questionIndex === 'all' ? index : 0;
    const endIndex: number = req.params.questionIndex === 'all' ? questionAmount : index === questionAmount ? questionAmount : index + 1;
    const correctResponses: any = {};
    activeQuiz.nicknames.forEach(attendee => {
      for (let i: number = questionIndex; i < endIndex; i++) {
        const question: IQuestion = activeQuiz.originalObject.questionList[i];
        if (question.TYPE === 'SurveyQuestion') {
          continue;
        }
        if (this._leaderboard.isCorrectResponse(attendee.responses[i], question) === 1) {
          if (!correctResponses[attendee.name]) {
            correctResponses[attendee.name] = {responseTime: 0};
          }
          correctResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
        } else {
          delete correctResponses[attendee.name];
          break;
        }
      }
    });
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_LEADERBOARD_DATA',
      payload: this._leaderboard.objectToArray(correctResponses)
    });
  }

  public init(): void {
    this._router.get('/:quizName/:questionIndex', this.getLeaderBoardData.bind(this));
  }
}

// Create the ApiRouter, and export its configured Express.Router
const leaderboardRoutes: LeaderboardRouter = new LeaderboardRouter();

export default leaderboardRoutes.router;
