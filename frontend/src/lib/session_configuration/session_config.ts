import {AbstractSessionConfiguration} from './session_config_abstract';
import {ISessionConfiguration} from './interfaces';

export class SessionConfiguration extends AbstractSessionConfiguration implements ISessionConfiguration {
  constructor(options: ISessionConfiguration) {
    super(options || {});
  }
}
