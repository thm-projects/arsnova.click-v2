import {SingleChoiceQuestion} from './question_choice_single';
import {YesNoSingleChoiceQuestion} from './question_choice_single_yes_no';
import {TrueFalseSingleChoiceQuestion} from './question_choice_single_true_false';
import {MultipleChoiceQuestion} from './question_choice_multiple';
import {RangedQuestion} from './question_ranged';
import {SurveyQuestion} from './question_survey';
import {FreeTextQuestion} from './question_freetext';
import {DefaultSettings} from '../../app/service/settings.service';
import {answerOptionReflection} from '../answeroptions/answeroption_reflection';
import {ABCDSingleChoiceQuestion} from 'lib/questions/question_choice_single_abcd';

export const questionReflection = {
  SingleChoiceQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}): SingleChoiceQuestion {
    return new SingleChoiceQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText ||
                         DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow ||
                           DefaultSettings.defaultSettings.question.showOneAnswerPerRow
    });
  },
  ABCDSingleChoiceQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}): YesNoSingleChoiceQuestion {
    return new ABCDSingleChoiceQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText ||
                         DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow ||
                           DefaultSettings.defaultSettings.question.showOneAnswerPerRow
    });
  },
  YesNoSingleChoiceQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}): YesNoSingleChoiceQuestion {
    return new YesNoSingleChoiceQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText ||
                         DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow ||
                           DefaultSettings.defaultSettings.question.showOneAnswerPerRow
    });
  },
  TrueFalseSingleChoiceQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}): TrueFalseSingleChoiceQuestion {
    return new TrueFalseSingleChoiceQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText ||
                         DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow ||
                           DefaultSettings.defaultSettings.question.showOneAnswerPerRow
    });
  },
  MultipleChoiceQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}): MultipleChoiceQuestion {
    return new MultipleChoiceQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText ||
                         DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow ||
                           DefaultSettings.defaultSettings.question.showOneAnswerPerRow
    });
  },
  SurveyQuestion: function ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow, multipleSelectionEnabled}): SurveyQuestion {
    return new SurveyQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      displayAnswerText: displayAnswerText || DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
      answerOptionList: answerOptionList || [],
      showOneAnswerPerRow: showOneAnswerPerRow || DefaultSettings.defaultSettings.question.showOneAnswerPerRow,
      multipleSelectionEnabled: multipleSelectionEnabled ||
                                DefaultSettings.defaultSettings.question.multipleSurveySelectionEnabled
    });
  },
  RangedQuestion: function ({questionText, timer, rangeMin, rangeMax, correctValue}): RangedQuestion {
    return new RangedQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      rangeMin: rangeMin || DefaultSettings.defaultSettings.question.rangeMin,
      rangeMax: rangeMax || DefaultSettings.defaultSettings.question.rangeMax,
      correctValue: correctValue || DefaultSettings.defaultSettings.question.correctValue
    });
  },
  FreeTextQuestion: function ({questionText, timer, answerOptionList}): FreeTextQuestion {
    return new FreeTextQuestion({
      questionText: questionText || DefaultSettings.defaultSettings.question.text,
      timer: timer || DefaultSettings.defaultSettings.question.timer,
      answerOptionList: answerOptionList || [answerOptionReflection.FreeTextAnswerOption({})]
    });
  }
};


