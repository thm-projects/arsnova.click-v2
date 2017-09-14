import {AbstractAnswerOption} from './answeroption_abstract';

export class FreeTextAnswerOption extends AbstractAnswerOption {
  get configCaseSensitive(): boolean {
    return this._configCaseSensitive;
  }

  set configCaseSensitive(value: boolean) {
    this._configCaseSensitive = value;
  }

  get configTrimWhitespaces(): boolean {
    return this._configTrimWhitespaces;
  }

  set configTrimWhitespaces(value: boolean) {
    this._configTrimWhitespaces = value;
  }

  get configUseKeywords(): boolean {
    return this._configUseKeywords;
  }

  set configUseKeywords(value: boolean) {
    this._configUseKeywords = value;
  }

  get configUsePunctuation(): boolean {
    return this._configUsePunctuation;
  }

  set configUsePunctuation(value: boolean) {
    this._configUsePunctuation = value;
  }

  readonly TYPE: string = "FreeTextAnswerOption";
  private _configCaseSensitive: boolean;
  private _configTrimWhitespaces: boolean;
  private _configUseKeywords: boolean;
  private _configUsePunctuation: boolean;

	constructor ({answerText, configCaseSensitive, configTrimWhitespaces, configUseKeywords, configUsePunctuation}) {
		super({answerText});
		this._configCaseSensitive = configCaseSensitive;
		this._configTrimWhitespaces = configTrimWhitespaces;
		this._configUseKeywords = configUseKeywords;
		this._configUsePunctuation = configUsePunctuation;
	}

	isCorrectInput(ref: string): boolean {
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
        result = refValue.split(' ').filter(function (elem) {
          return ref.indexOf(elem) === -1;
        }).length === 0;
      } else {
        result = refValue === ref;
      }
    }
    return result;
  }

	setConfig (configIdentifier: string, configValue: boolean) {
		switch (configIdentifier) {
			case "config_case_sensitive_switch":
				this.configCaseSensitive = configValue;
				break;
			case "config_trim_whitespaces_switch":
				this.configTrimWhitespaces = configValue;
				break;
			case "config_use_keywords_switch":
				this.configUseKeywords = configValue;
				break;
			case "config_use_punctuation_switch":
				this.configUsePunctuation = configValue;
				break;
			default:
				throw Error("Config not found");
		}
	}

	getConfig () {
		return [
			{
				configTitle: "component.answeroptions.free_text_question.config_case_sensitive",
				configEnabledString: "component.answeroptions.free_text_question." + (this.configCaseSensitive ? "onText" : "offText"),
        enabled: this.configCaseSensitive,
        id: 'config_case_sensitive_switch'
			},
			{
				configTitle: "component.answeroptions.free_text_question.config_trim_whitespaces",
        configEnabledString: "component.answeroptions.free_text_question." + (this.configTrimWhitespaces ? "onText" : "offText"),
        enabled: this.configTrimWhitespaces,
        id: 'config_trim_whitespaces_switch'
			},
			{
				configTitle: "component.answeroptions.free_text_question.config_use_keywords",
        configEnabledString: "component.answeroptions.free_text_question." + (this.configUseKeywords ? "onText" : "offText"),
        enabled: this.configUseKeywords,
        id: 'config_use_keywords_switch'
			},
			{
				configTitle: "component.answeroptions.free_text_question.config_use_punctuation",
        configEnabledString: "component.answeroptions.free_text_question." + (this.configUsePunctuation ? "onText" : "offText"),
        enabled: this.configUsePunctuation,
        id: 'config_use_punctuation_switch'
			}
		];
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionIndex:Number,answerText:String,answerOptionNumber:Number,configCaseSensitive:Boolean,configTrimWhitespaces:Boolean,configUseKeywords:Boolean,configUseKeywords:Boolean,configUsePunctuation:Boolean,type:String}}
	 */
	serialize () {
		return Object.assign(super.serialize(), {
			configCaseSensitive: this.configCaseSensitive,
			configTrimWhitespaces: this.configTrimWhitespaces,
			configUseKeywords: this.configUseKeywords,
			configUsePunctuation: this.configUsePunctuation,
			type: this.TYPE
		});
	}

	/**
	 * Checks for equivalence relations to another AnswerOption instance. Also part of the EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
	 * @param {AbstractAnswerOption} answerOption The AnswerOption instance which should be checked
	 * @returns {boolean} True if both instances are completely equal, False otherwise
	 */
	equals (answerOption: FreeTextAnswerOption) {
		return super.equals(answerOption) &&
			answerOption.configCaseSensitive === this.configCaseSensitive &&
			answerOption.configTrimWhitespaces === this.configTrimWhitespaces &&
			answerOption.configUseKeywords === this.configUseKeywords &&
			answerOption.configUsePunctuation === this.configUsePunctuation;
	}
}
