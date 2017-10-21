import {IActiveQuiz} from '../../interfaces/common.interfaces';

export function calculateNumberOfAnswers(quiz: IActiveQuiz, questionIndex: number, answerNumber: number) {
  let numberOfAnswers = 0;
  quiz.nicknames.forEach(nickname => {
    const response = nickname.responses[questionIndex].value;
    if (response instanceof Array) {
      numberOfAnswers += response.indexOf(answerNumber) > -1 ? 1 : 0;
    } else if (typeof response === 'number') {
      numberOfAnswers += response;
    }
  });
  return numberOfAnswers;
}

export function calculateNumberOfRangedAnswers(quiz: IActiveQuiz, questionIndex: number, minRange, correctValue, maxRange) {
  let numberOfAnswersInMinRange = 0;
  let numberOfAnswersInMaxRange = 0;
  let numberOfCorrectAnswers = 0;
  quiz.nicknames.forEach(function (nickname) {
      if (nickname.responses[questionIndex].value <= maxRange && nickname.responses[questionIndex].value > correctValue) {
        numberOfAnswersInMaxRange++;
      } else if (nickname.responses[questionIndex].value === correctValue) {
        numberOfCorrectAnswers++;
      } else if (nickname.responses[questionIndex].value >= minRange) {
        numberOfAnswersInMinRange++;
      }
  });
  return {
    minRange: numberOfAnswersInMinRange,
    correctValue: numberOfCorrectAnswers,
    maxRange: numberOfAnswersInMaxRange
  };
}
