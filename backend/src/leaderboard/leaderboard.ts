import {IAnswerOption, IFreetextAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IQuestion, IQuestionChoice, IQuestionFreetext, IQuestionRanged} from '../interfaces/questions/interfaces';
import {IQuizResponse} from '../interfaces/common.interfaces';

export declare interface ILeaderBoardItem {
  name: string;
  correctQuestions: Array<number>;
  responseTime: number;
  confidenceValue: number;
}

export class Leaderboard {
  private isCorrectSingleChoiceQuestion(response: number, question: IQuestionChoice): boolean {
    return question.answerOptionList[response].isCorrect;
  }

  private isCorrectMultipleChoiceQuestion(response: Array<number>, question: IQuestionChoice): number {
    let hasCorrectAnswer = 0;
    let hasWrongAnswer = 0;
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
    let userHasRightAnswers = false;
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
      let hasCorrectKeywords = true;
      answerOption.answerText.split(' ').forEach(keyword => {
        if (clonedResponse.indexOf(keyword) === -1) {
          hasCorrectKeywords = false;
        }
      });
      userHasRightAnswers = hasCorrectKeywords;
    }
    return userHasRightAnswers;
  }

  public isCorrectResponse(response: IQuizResponse, question: IQuestion): number {
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

  public objectToArray(obj: Object): Array<ILeaderBoardItem> {
    const keyList: Array<string> = Object.keys(obj);
    return keyList.map((value, index) => {
      return {
        name: keyList[index],
        correctQuestions: obj[value].correctQuestions || [],
        responseTime: obj[value].responseTime || -1,
        confidenceValue: obj[value].confidenceValue || -1
      };
    });
  }
}
