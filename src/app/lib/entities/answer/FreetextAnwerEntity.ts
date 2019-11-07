import { DefaultSettings } from '../../default.settings';
import { AnswerType } from '../../enums/AnswerType';
import { IFreetextAnswerConfiguration } from '../../interfaces/answeroptions/IFreetextAnswerConfiguration';
import { AbstractAnswerEntity } from './AbstractAnswerEntity';

export class FreeTextAnswerEntity extends AbstractAnswerEntity {
  public readonly TYPE = AnswerType.FreeTextAnswerOption;

  public configCaseSensitive: boolean = DefaultSettings.defaultQuizSettings.answers.configCaseSensitive;
  public configTrimWhitespaces: boolean = DefaultSettings.defaultQuizSettings.answers.configTrimWhitespaces;
  public configUseKeywords: boolean = DefaultSettings.defaultQuizSettings.answers.configUseKeywords;
  public configUsePunctuation: boolean = DefaultSettings.defaultQuizSettings.answers.configUsePunctuation;

  constructor(props) {
    super(props);

    this.configCaseSensitive = typeof props.configCaseSensitive !== 'undefined' ? props.configCaseSensitive : this.configCaseSensitive;
    this.configTrimWhitespaces = typeof props.configTrimWhitespaces !== 'undefined' ? props.configTrimWhitespaces : this.configTrimWhitespaces;
    this.configUseKeywords = typeof props.configUseKeywords !== 'undefined' ? props.configUseKeywords : this.configUseKeywords;
    this.configUsePunctuation = typeof props.configUsePunctuation !== 'undefined' ? props.configUsePunctuation : this.configUsePunctuation;
  }

  public isCorrectInput(ref: string): boolean {
    let refValue = this.answerText;
    let result = false;
    if (!this.configCaseSensitive) {
      refValue = refValue.toLowerCase();
      ref = ref.toLowerCase();
      result = refValue === ref;
    }
    if (this.configTrimWhitespaces) {
      refValue = refValue.replace(/ /g, '');
      ref = ref.replace(/ /g, '');
      result = refValue === ref;
    } else {
      if (!this.configUsePunctuation) {
        refValue = refValue.replace(/[,:\(\)\[\]\.\*\?]/g, '');
        ref = ref.replace(/[,:\(\)\[\]\.\*\?]/g, '');
      }
      if (!this.configUseKeywords) {
        result = refValue.split(' ').filter(elem => {
          return ref.indexOf(elem) === -1;
        }).length === 0;
      } else {
        result = refValue === ref;
      }
    }
    return result;
  }

  public setConfig(configIdentifier: string, configValue: boolean): void {
    switch (configIdentifier) {
      case 'config_case_sensitive_switch':
        this.configCaseSensitive = configValue;
        break;
      case 'config_trim_whitespaces_switch':
        this.configTrimWhitespaces = configValue;
        break;
      case 'config_use_keywords_switch':
        this.configUseKeywords = configValue;
        break;
      case 'config_use_punctuation_switch':
        this.configUsePunctuation = configValue;
        break;
      default:
        throw Error('Config not found');
    }
  }

  public getConfig(): Array<IFreetextAnswerConfiguration> {
    return [
      {
        configTitle: 'component.answeroptions.free_text_question.config_case_sensitive',
        configEnabledString: 'component.answeroptions.free_text_question.' + (this.configCaseSensitive ? 'onText' : 'offText'),
        enabled: this.configCaseSensitive,
        id: 'config_case_sensitive_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_trim_whitespaces',
        configEnabledString: 'component.answeroptions.free_text_question.' + (this.configTrimWhitespaces ? 'onText' : 'offText'),
        enabled: this.configTrimWhitespaces,
        id: 'config_trim_whitespaces_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_use_keywords',
        configEnabledString: 'component.answeroptions.free_text_question.' + (this.configUseKeywords ? 'onText' : 'offText'),
        enabled: this.configUseKeywords,
        id: 'config_use_keywords_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_use_punctuation',
        configEnabledString: 'component.answeroptions.free_text_question.' + (this.configUsePunctuation ? 'onText' : 'offText'),
        enabled: this.configUsePunctuation,
        id: 'config_use_punctuation_switch',
      },
    ];
  }

  public equals(answerOption: FreeTextAnswerEntity): boolean {
    return super.equals(answerOption) && answerOption.configCaseSensitive === this.configCaseSensitive && answerOption.configTrimWhitespaces
           === this.configTrimWhitespaces && answerOption.configUseKeywords === this.configUseKeywords && answerOption.configUsePunctuation
           === this.configUsePunctuation;
  }
}
