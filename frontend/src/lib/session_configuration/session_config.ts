import {AbstractSessionConfiguration} from './session_config_abstract';

export class SessionConfiguration extends AbstractSessionConfiguration {
	constructor (options) {
		super(options);
	}

	clone (): SessionConfiguration {
		return new SessionConfiguration(this.serialize());
	}
}
