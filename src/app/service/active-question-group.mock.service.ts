import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {DefaultQuestionGroup} from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import {SingleChoiceQuestion} from 'arsnova-click-v2-types/src/questions/question_choice_single';
import {SessionConfiguration} from 'arsnova-click-v2-types/src/session_configuration/session_config';
import {DefaultSettings} from '../../lib/default.settings';
import {FreeTextQuestion} from 'arsnova-click-v2-types/src/questions/question_freetext';
import {FreeTextAnswerOption} from 'arsnova-click-v2-types/src/answeroptions/answeroption_freetext';
import {RangedQuestion} from 'arsnova-click-v2-types/src/questions/question_ranged';

export class ActiveQuestionGroupMockService {
  activeQuestionGroup: IQuestionGroup;

  constructor() {
    this.activeQuestionGroup = new DefaultQuestionGroup({
      hashtag: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
      questionList: [
        new SingleChoiceQuestion({}),
        new FreeTextQuestion({questionText: '', timer: 0, answerOptionList: [
          new FreeTextAnswerOption({
            answerText: '',
            configCaseSensitive: true,
            configTrimWhitespaces: true,
            configUseKeywords: true,
            configUsePunctuation: true
          })]}),
        new RangedQuestion({questionText: '', timer: 0, correctValue: 20, rangeMin: 10, rangeMax: 30})
      ]
    });
  }

  cleanUp() {}

  persist() {}
}
