import { DefaultSettings } from '../../../../lib/default.settings';
import { StorageKey } from '../../../../lib/enums/enums';

export abstract class AbstractStorageAdapter<T> {

  protected storage: T;

  protected constructor(storage: T) {
    this.storage = storage;
  }

  protected getDefaultValue(key: StorageKey): any {
    switch (key) {

      case StorageKey.Language:
        return false;
      case StorageKey.QuizTheme:
        return false;
      case StorageKey.DefaultTheme:
        return DefaultSettings.defaultQuizSettings.sessionConfig.theme;
    }
  }

}
