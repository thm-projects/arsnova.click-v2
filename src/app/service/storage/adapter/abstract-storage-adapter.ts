import { DefaultSettings } from '../../../../lib/default.settings';
import { STORAGE_KEY } from '../../../shared/enums';

export abstract class AbstractStorageAdapter<T> {

  protected storage: T;

  protected constructor(storage: T) {
    this.storage = storage;
  }

  protected getDefaultValue(key: STORAGE_KEY): any {
    switch (key) {

      case STORAGE_KEY.WEBSOCKET_AUTHORIZATION:
        return false;
      case STORAGE_KEY.PROVIDE_NICK_SELECTION:
        return false;
      case STORAGE_KEY.ATTENDEES:
        return [];
      case STORAGE_KEY.SERVER_SETTINGS:
        return false;
      case STORAGE_KEY.TOKEN:
        return false;
      case STORAGE_KEY.MEMBER_GROUP:
        return false;
      case STORAGE_KEY.CURRENT_QUIZ:
        return false;
      case STORAGE_KEY.ACTIVE_QUESTION_GROUP:
        return false;
      case STORAGE_KEY.LANGUAGE:
        return false;
      case STORAGE_KEY.QUIZ_THEME:
        return false;
      case STORAGE_KEY.PRIVATE_KEY:
        return false;
      case STORAGE_KEY.NICK:
        return false;
      case STORAGE_KEY.INTRO_STATE:
        return false;
      case STORAGE_KEY.SHOW_PRODUCT_TOUR:
        return false;
      case STORAGE_KEY.DEFAULT_THEME:
        return DefaultSettings.defaultQuizSettings.theme;
    }
  }

}
