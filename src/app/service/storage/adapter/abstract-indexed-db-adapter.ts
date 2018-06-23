import { DB_NAME, DB_TABLE, STORAGE_KEY } from '../../../shared/enums';
import { AbstractStorageAdapter } from './abstract-storage-adapter';

export class AbstractIndexedDbAdapter extends AbstractStorageAdapter<IDBDatabase> {

  constructor(db: IDBFactory, dbName: DB_NAME) {
    super(null);

    const request = db.open(dbName, 1);
    request.onupgradeneeded = () => {
      console.log('Datenbank angelegt', dbName, Object.keys(DB_TABLE));
      this.storage = request.result;

      Object.keys(DB_TABLE).forEach(dbtablesKey => {
        console.log('checking if store exists', dbtablesKey, 'result:', this.storage.objectStoreNames.contains(dbtablesKey));
        if (!this.storage.objectStoreNames.contains(dbtablesKey)) {
          console.log('creating store', dbtablesKey);
          this.storage.createObjectStore(dbtablesKey, {
            keyPath: 'key',
            autoIncrement: true,
          });
        }
      });
    };
    request.onsuccess = () => {
      this.storage = request.result;
      console.log('Datenbank geöffnet');
    };
  }

  public async get(table: DB_TABLE, key: any): Promise<any> {
    return new Promise<void>(resolve => {
      const request = this.getStore(table).get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async set(table: DB_TABLE, key: STORAGE_KEY | string, item: object | Array<any> | string | number): Promise<any> {
    return new Promise<void>(resolve => {
      const request = this.getStore(table).put(Object.assign({}, key, item));
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async remove(table: DB_TABLE, key: IDBKeyRange | IDBValidKey): Promise<any> {
    return new Promise<void>(resolve => {
      const request = this.getStore(table).delete(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public getDefaultValue(key: STORAGE_KEY): any {
    return super.getDefaultValue(key);
  }

  private getStore(table: DB_TABLE): IDBObjectStore {
    const trans = this.storage.transaction([table], 'readwrite');
    return trans.objectStore(table);
  }

}
