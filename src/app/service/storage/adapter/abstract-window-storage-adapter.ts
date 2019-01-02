import { StorageKey } from '../../../../lib/enums/enums';
import { AbstractStorageAdapter } from './abstract-storage-adapter';

export abstract class AbstractWindowStorageAdapter<T extends Storage> extends AbstractStorageAdapter<T> {

  protected constructor(storage: T) {
    super(storage);
  }

  public get(key: string): any {
    return JSON.parse(this.storage.getItem(key));
  }

  public set(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  public getDefaultValue(key: StorageKey): any {
    return super.getDefaultValue(key);
  }
}
