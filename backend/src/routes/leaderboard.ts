import {Router, Request, Response, NextFunction} from 'express';
import QuizManagerDAO from '../db/quiz-manager';
import {IQuestion, IQuestionChoice, IQuestionFreetext, IQuestionRanged} from '../interfaces/questions/interfaces';
import {IAnswerOption, IFreetextAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IActiveQuiz, IQuizResponse} from '../interfaces/common.interfaces';

export class LeaderboardRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the LeaderboardRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  private isCorrectSingleChoiceQuestion(response: number, question: IQuestionChoice): boolean {
    return question.answerOptionList[response].isCorrect;
  }

  private isCorrectMultipleChoiceQuestion(response: Array<number>, question: IQuestionChoice): number {
    let hasCorrectAnswer: number = 0;
    let hasWrongAnswer: number = 0;
    const correctAnswers: Array<IAnswerOption> = question.answerOptionList.filter((answeroption) => {
      return answeroption.isCorrect;
    });
    response.every((element) => {
      const tmpCorrectAnswer: number = hasCorrectAnswer;
      correctAnswers.every((item, index) => {
        if (element === index) {
          hasCorrectAnswer++;
          return false;
        }
        return true;
      });
      if (tmpCorrectAnswer === hasCorrectAnswer) {
        hasWrongAnswer++;
      }
      return true;
    });
    if (hasWrongAnswer > 0) {
      return -1;
    }
    if (hasCorrectAnswer > 0) {
      if (correctAnswers.length === hasCorrectAnswer) {
        return 1;
      } else {
        return 0;
      }
    }
    return -1;
  }

  private isCorrectRangedQuestion(response: Array<number>, question: IQuestionRanged): number {
    return response[0] >= question.rangeMin && response[1] <= question.rangeMax ? 0 : response[2] === question.correctValue ? 1 : -1;
  }

  private isCorrectFreeTextQuestion(response: string, question: IQuestionFreetext): boolean {
    const answerOption: IFreetextAnswerOption = <IFreetextAnswerOption>question.answerOptionList[0];
    let userHasRightAnswers: boolean = false;
    let clonedResponse: string = JSON.parse(JSON.stringify(response));
    if (!answerOption.configCaseSensitive) {
      answerOption.answerText = answerOption.answerText.toLowerCase();
      clonedResponse = clonedResponse.toLowerCase();
    }
    if (!answerOption.configUsePunctuation) {
      answerOption.answerText = answerOption.answerText.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, '');
      clonedResponse = clonedResponse.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, '');
    }
    if (answerOption.configUseKeywords) {
      if (!answerOption.configTrimWhitespaces) {
        answerOption.answerText = answerOption.answerText.replace(/ /g, '');
        clonedResponse = clonedResponse.replace(/ /g, '');
      }
      userHasRightAnswers = answerOption.answerText === clonedResponse;
    } else {
      let hasCorrectKeywords: boolean = true;
      answerOption.answerText.split(' ').forEach(keyword => {
        if (clonedResponse.indexOf(keyword) === -1) {
          hasCorrectKeywords = false;
        }
      });
      userHasRightAnswers = hasCorrectKeywords;
    }
    return userHasRightAnswers;
  }

  private isCorrectResponse(response: IQuizResponse, question: IQuestion): number {
    switch (question.TYPE) {
      case 'SingleChoiceQuestion':
      case 'YesNoSingleChoiceQuestion':
      case 'TrueFalseSingleChoiceQuestion':
        return this.isCorrectSingleChoiceQuestion(<number>response.value, <IQuestionChoice>question) ? 1 : -1;
      case 'MultipleChoiceQuestion':
        return this.isCorrectMultipleChoiceQuestion(<Array<number>>response.value, <IQuestionChoice>question);
      case 'ABCDSingleChoiceQuestion':
      case 'SurveyQuestion':
        return 1;
      case 'RangedQuestion':
        return this.isCorrectRangedQuestion(<Array<number>>response.value, <IQuestionRanged>question);
      case 'FreeTextQuestion':
        return this.isCorrectFreeTextQuestion(<string>response.value, <IQuestionFreetext>question) ? 1 : -1;
      default:
        console.log(question);
        throw new Error(`Unsupported question type while checking correct response. Received type ${question.TYPE}`);
    }
  }

  private objectToArray(obj: Object): Array<Object> {
    const keyList: Array<string> = Object.keys(obj);
    return keyList.map((value, index) => {
      return {
        name: keyList[index],
        responseTime: obj[value].responseTime
      };
    });
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
        if (this.isCorrectResponse(attendee.responses[i], question) === 1) {
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
      payload: this.objectToArray(correctResponses)
    });
  }

  public init(): void {
    this._router.get('/:quizName/:questionIndex', this.getLeaderBoardData.bind(this));
  }
}

// Create the ApiRouter, and export its configured Express.Router
const leaderboardRoutes: LeaderboardRouter = new LeaderboardRouter();

export default leaderboardRoutes.router;
