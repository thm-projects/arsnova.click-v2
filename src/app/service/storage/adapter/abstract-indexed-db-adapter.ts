import { DbName, DbTable, StorageKey } from '../../../../lib/enums/enums';
import { AbstractStorageAdapter } from './abstract-storage-adapter';

export class AbstractIndexedDbAdapter extends AbstractStorageAdapter<IDBDatabase> {

  constructor(db: IDBFactory, dbName: DbName) {
    super(null);

    const request = db.open(dbName, 1);
    request.onupgradeneeded = () => {
      console.log('Datenbank angelegt', dbName, Object.keys(DbTable));
      this.storage = request.result;

      Object.keys(DbTable).forEach(dbtablesKey => {
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

  public async get(table: DbTable, key: any): Promise<any> {
    return new Promise<void>(resolve => {
      const request = this.getStore(table).get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async set(table: DbTable, key: StorageKey | string, item: object | Array<any> | string | number): Promise<any> {
    return new Promise<IDBValidKey>(resolve => {
      const request = this.getStore(table).put(Object.assign({}, key, item));
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async remove(table: DbTable, key: IDBKeyRange | IDBValidKey): Promise<any> {
    return new Promise<void>(resolve => {
      const request = this.getStore(table).delete(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public getDefaultValue(key: StorageKey): any {
    return super.getDefaultValue(key);
  }

  private getStore(table: DbTable): IDBObjectStore {
    const trans = this.storage.transaction([table], 'readwrite');
    return trans.objectStore(table);
  }

}
