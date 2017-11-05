import {IAnswerOption, IFreetextAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IQuestion, IQuestionChoice, IQuestionFreetext, IQuestionRanged} from '../interfaces/questions/interfaces';
import {IQuizResponse} from '../interfaces/common.interfaces';

export declare interface ILeaderBoardItem {
  name: string;
  responseTime: number;
  correctQuestions: Array<number>;
  confidenceValue: number;
}

export class Leaderboard {
  private isCorrectSingleChoiceQuestion(response: number, question: IQuestionChoice): boolean {
    return question.answerOptionList[response].isCorrect;
  }

  private isCorrectMultipleChoiceQuestion(response: Array<number>, question: IQuestionChoice): number {
    let hasCorrectAnswer = 0;
    response.forEach((element) => {
      if (question.answerOptionList[element].isCorrect) {
        hasCorrectAnswer++;
      }
    });
    return question.answerOptionList.filter((answeroption) => {
      return answeroption.isCorrect;
    }).length === hasCorrectAnswer ? 1 : hasCorrectAnswer ? 0 : -1;
  }

  private isCorrectRangedQuestion(response: number, question: IQuestionRanged): number {
    return response === question.correctValue ? 1 : response >= question.rangeMin && response <= question.rangeMax ? 0 : -1;
  }

  private isCorrectFreeTextQuestion(response: string, question: IQuestionFreetext): boolean {
    const answerOption: IFreetextAnswerOption = <IFreetextAnswerOption>question.answerOptionList[0];
    let refValue = answerOption.answerText;
    let result = false;
    if (!answerOption.configCaseSensitive) {
      refValue = refValue.toLowerCase();
      response = response.toLowerCase();
      result = refValue === response;
    }
    if (answerOption.configTrimWhitespaces) {
      refValue = refValue.replace(/ /g, '');
      response = response.replace(/ /g, '');
      result = refValue === response;
    } else {
      if (!answerOption.configUsePunctuation) {
        refValue = refValue.replace(/[,:\(\)\[\]\.\*\?]/g, '');
        response = response.replace(/[,:\(\)\[\]\.\*\?]/g, '');
      }
      if (!answerOption.configUseKeywords) {
        result = refValue.split(' ').filter(function (elem) {
          return response.indexOf(elem) === -1;
        }).length === 0;
      } else {
        result = refValue === response;
      }
    }
    return result;
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
        return this.isCorrectRangedQuestion(<number>response.value, <IQuestionRanged>question);
      case 'FreeTextQuestion':
        return this.isCorrectFreeTextQuestion(<string>response.value, <IQuestionFreetext>question) ? 1 : -1;
      default:
        console.log(question);
        throw new Error(`Unsupported question type while checking correct response. Received type ${question.TYPE}`);
    }
  }

  public objectToArray(obj: Object): Array<ILeaderBoardItem> {
    const keyList: Array<string> = Object.keys(obj);
    if (!keyList.length) {
      return [];
    }
    return keyList.map((value, index) => {
      return {
        name: keyList[index],
        responseTime: obj[value].responseTime || -1,
        correctQuestions: obj[value].correctQuestions,
        confidenceValue: obj[value].confidenceValue / obj[value].correctQuestions.length
      };
    });
  }
}
