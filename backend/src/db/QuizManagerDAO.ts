import {parseCachedAssetQuiz} from '../cache/assets';
import {DatabaseTypes, DbDao} from './DbDAO';
import {IQuestionGroup} from '../interfaces/questions/interfaces';
import {IActiveQuiz} from '../interfaces/common.interfaces';
import {ActiveQuizItem, ActiveQuizItemPlaceholder} from '../quiz-manager/quiz-manager';

const activeQuizzes: Object = {};

const privateServerConfig = require('../../settings.json');
privateServerConfig.public.limitActiveQuizzes = parseFloat(privateServerConfig.public.limitActiveQuizzes);

export class QuizManagerDAO {
  private static checkABCDOrdering(hashtag: string): boolean {
    let ordered = true;
    if (!hashtag || hashtag.length < 2 || hashtag.charAt(0) !== 'a') {
      return false;
    }
    for (let i = 1; i < hashtag.length; i++) {
      if (hashtag.charCodeAt(i) !== hashtag.charCodeAt(i - 1) + 1) {
        ordered = false;
        break;
      }
    }
    return ordered;
  }

  public static normalizeQuizName(quizName: string): string {
    return quizName ? quizName.toLowerCase() : '';
  }

  public static getRenameRecommendations(quizName: string): Array<string> {
    const result = [];
    const count = Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return name.startsWith(quizName.toLowerCase());
    }).length;
    const date = new Date();
    const dateYearPart = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    const dateFormatted = `${dateYearPart}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    result.push(`${quizName} ${count + 1}`);
    result.push(`${quizName} ${dateFormatted}`);
    result.push(`${quizName}_${Math.random()}`);
    return result;
  }

  public static setQuizAsInactive(quizName: string): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quizName);
    if (activeQuizzes[name]) {
      activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
    }
  }

  public static initInactiveQuiz(quizName: string): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quizName);
    if (activeQuizzes[name]) {
      return;
    }
    activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
  }

  public static initActiveQuiz(quiz: IQuestionGroup): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(quiz.hashtag);
    if (activeQuizzes[name] && !(activeQuizzes[name] instanceof ActiveQuizItemPlaceholder)) {
      return;
    }
    QuizManagerDAO.convertLegacyQuiz(quiz);
    if (privateServerConfig.public.cacheQuizAssets) {
      parseCachedAssetQuiz(quiz.questionList);
    }
    activeQuizzes[name] = new ActiveQuizItem({nicknames: [], originalObject: quiz});
    return activeQuizzes[name];
  }

  public static removeQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    if (!activeQuizzes[name]) {
      return;
    }
    delete activeQuizzes[name];
    return true;
  }

  public static getActiveQuizByName(originalName: string): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
      return;
    }
    return activeQuizzes[name];
  }

  public static updateActiveQuiz(data: IActiveQuiz): void {
    const name: string = QuizManagerDAO.normalizeQuizName(data.originalObject.hashtag);
    if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
      return;
    }
    activeQuizzes[name] = data;
  }

  public static getAllActiveQuizNames(): Array<string> {
    return Object.keys(activeQuizzes)
      .filter(name => !this.isInactiveQuiz(name));
  }

  public static getAllPersistedQuizzes(): Object {
    return activeQuizzes;
  }

  public static getPersistedQuizByName(originalName: string): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name];
  }

  public static isActiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name] && activeQuizzes[name] instanceof ActiveQuizItem;
  }

  public static isInactiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name] && activeQuizzes[name] instanceof ActiveQuizItemPlaceholder;
  }

  public static getAllActiveMembers(): number {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
        return;
      }
      return activeQuizzes[name].nicknames.length;
    }).reduce((a: number, b: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(b);
      return parseInt(a + activeQuizzes[name].nicknames.length, 10);
    }, 0);
  }

  public static getAllPersistedDemoQuizzes(): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return activeQuizzes[name].name.toLowerCase().startsWith('demo quiz');
    });
  }

  public static getAllPersistedAbcdQuizzes(): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return QuizManagerDAO.checkABCDOrdering(activeQuizzes[name].name);
    });
  }

  public static getAllPersistedAbcdQuizzesByLength(length: number): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return QuizManagerDAO.checkABCDOrdering(activeQuizzes[name].name) &&
        activeQuizzes[name].originalObject.questionList[0].answerOptionList.length === length;
    });
  }

  private static replaceTypeInformationOnLegacyQuiz(obj): void {
    if (obj.hasOwnProperty('type')) {
      obj.TYPE = obj.type;
      delete obj.type;
      Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
          obj[key].forEach((elem, index) => {
            this.replaceTypeInformationOnLegacyQuiz(obj[key][index]);
          });
        } else if (obj[key] instanceof Object) {
          this.replaceTypeInformationOnLegacyQuiz(obj[key]);
        }
      });
    }
  }

  public static convertLegacyQuiz(legacyQuiz: any): void {
    QuizManagerDAO.replaceTypeInformationOnLegacyQuiz(legacyQuiz);
    if (legacyQuiz.hasOwnProperty('configuration')) {
      // Detected old v1 arsnova.click quiz
      legacyQuiz.sessionConfig = {
        music: {
          titleConfig: {
            lobby: legacyQuiz.configuration.music.lobbyTitle,
            countdownRunning: legacyQuiz.configuration.music.countdownRunningTitle,
            countdownEnd: legacyQuiz.configuration.music.countdownEndTitle
          },
          volumeConfig: {
            global: legacyQuiz.configuration.music.lobbyVolume,
            lobby: legacyQuiz.configuration.music.lobbyVolume,
            countdownRunning: legacyQuiz.configuration.music.countdownRunningVolume,
            countdownEnd: legacyQuiz.configuration.music.countdownEndVolume,
            useGlobalVolume: legacyQuiz.configuration.music.isUsingGlobalVolume,
          },
          lobbyEnabled: legacyQuiz.configuration.music.lobbyEnabled,
          countdownRunningEnabled: legacyQuiz.configuration.music.countdownRunningEnabled,
          countdownEndEnabled: legacyQuiz.configuration.music.countdownEndEnabled
        },
        nicks: {
          selectedNicks: legacyQuiz.configuration.nicks.selectedValues,
          blockIllegalNicks: legacyQuiz.configuration.nicks.blockIllegal,
          restrictToCasLogin: legacyQuiz.configuration.nicks.restrictToCASLogin
        },
        theme: legacyQuiz.configuration.theme,
        readingConfirmationEnabled: legacyQuiz.configuration.readingConfirmationEnabled,
        showResponseProgress: legacyQuiz.configuration.showResponseProgress,
        confidenceSliderEnabled: legacyQuiz.configuration.confidenceSliderEnabled
      };
      delete legacyQuiz.configuration;
    }
  }
}

DbDao.getState()[DatabaseTypes.quiz].forEach((value) => {
  activeQuizzes[QuizManagerDAO.normalizeQuizName(value.quizName)] = new ActiveQuizItemPlaceholder(value.quizName);
});
