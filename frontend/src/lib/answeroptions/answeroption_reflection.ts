import {DefaultAnswerOption} from "./answeroption_default";
import {FreeTextAnswerOption} from "./answeroption_freetext";
import {DefaultSettings} from "../../app/service/settings.service";

export const answerOptionReflection = {
  DefaultAnswerOption: function ({answerText, isCorrect}) {
    return new DefaultAnswerOption({answerText, isCorrect});
  },
  FreeTextAnswerOption: function ({ answerText = DefaultSettings.defaultSettings.answers.answerText,
                                    configCaseSensitive = DefaultSettings.defaultSettings.answers.configCaseSensitive,
                                    configTrimWhitespaces = DefaultSettings.defaultSettings.answers.configTrimWhitespaces,
                                    configUseKeywords = DefaultSettings.defaultSettings.answers.configUseKeywords,
                                    configUsePunctuation = DefaultSettings.defaultSettings.answers.configUsePunctuation
  }) {
    return new FreeTextAnswerOption({answerText, configCaseSensitive, configTrimWhitespaces, configUseKeywords, configUsePunctuation});
  }
};
