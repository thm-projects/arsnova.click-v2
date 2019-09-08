import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { DbName, DbState, DbTable, StorageKey } from '../../../lib/enums/enums';

interface ISchema {
  name: DbTable;
  indexes?: Array<string>;
  seeds?: Array<any>;
}

@Injectable()
export class IndexedDbService {
  get stateNotifier(): BehaviorSubject<DbState> {
    return this._stateNotifier;
  }

  private _dbName: string;

  get dbName(): string {
    return this._dbName;
  }

  private _dbInstance: IDBOpenDBRequest;

  set dbInstance(value: IDBOpenDBRequest) {
    this._dbInstance = value;
  }

  private _isInitialized = false;

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  set isInitialized(value: boolean) {
    this._isInitialized = value;
  }

  private _indexedDB: IDBFactory;
  private readonly _stateNotifier = new BehaviorSubject<DbState>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._indexedDB = indexedDB;
    }

    this._dbName = DbName.Default; // by default
  }

  public setName(dbName: string): void {
    if (typeof dbName !== 'undefined' && dbName.length > 0) {
      this._dbName = dbName;
      this._dbInstance = null;
      this._isInitialized = false;
      this.stateNotifier.next(DbState.Destroy);
    } else {
      console.error('Error: invalid dbName');
    }
  }

  public put(source: DbTable, object: any): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);
        store.put(object);

        tx.oncomplete = () => {
          observer.next(object);
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          console.error('IndexedDbService: Error in put() function');
          self.handleError(e);
        };
      });
    });
  }

  public post(source: DbTable, object: any): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);
        const request = store.add(object);

        request.onsuccess = (e: any) => {
          observer.next(e.target.result);
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          console.error('IndexedDbService: Error in post() function');
          self.handleError(e);
        };
      });
    });
  }

  public get(source: DbTable, id: StorageKey | string): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readonly');
        const store = tx.objectStore(source);
        const index = store.index('id_idx');
        const request = index.get(id);

        request.onsuccess = () => {
          observer.next(request.result ? request.result.value ? request.result.value : request.result : null);
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          console.error('IndexedDbService: Error in get() function', source, id, index);
          self.handleError(e);
        };
      });
    });
  }

  public all(source: DbTable, filter?: string): Observable<{ id: string, value: any }[]> {
    const self = this;

    return Observable.create((observer: any) => {
      const indexName = 'id_idx';

      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readonly');
        const store = tx.objectStore(source);
        const index = store.index(indexName);
        const request = index.openCursor();
        const results: any[] = [];

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            observer.next(results);
            observer.complete();
          }
        };
        db.onerror = (e: any) => {
          db.close();
          console.error('IndexedDbService: Error in all() function');
          self.handleError(e);
        };
      });
    });
  }

  public remove(source: DbTable, id: StorageKey | string): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);

        store.delete(id);

        tx.oncomplete = (e: any) => {
          observer.next(id);
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError(e);
        };
      });
    });
  }

  public count(source: DbTable): Observable<number> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const indexName = 'id_idx';
        const tx = db.transaction(source, 'readonly');
        const store = tx.objectStore(source);
        const index = store.index(indexName);
        const request = index.count();

        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError(e);
        };
      });
    });
  }

  public create(schema?: Array<ISchema>): Observable<any> {
    return Observable.create((observer: any) => {
      const instance = this._indexedDB.open(this._dbName, 1);
      console.log('IndexedDbService: opening instance', instance, schema);

      instance.onblocked = event => {
        console.log('IndexedDbService: Db is currently blocked', event);
      };

      instance.onupgradeneeded = () => {
        // The database did not previously exist, so create object stores and indexes.
        const db = instance.result;
        console.log('IndexedDbService: onupgradeneeded called', db, schema);

        for (let i = 0; i < schema.length; i++) {
          const store = db.createObjectStore(schema[i].name, {
            keyPath: 'id',
            autoIncrement: true,
          });
          console.log('IndexedDbService: Creating schema index', schema);
          store.createIndex('id_idx', 'id', { unique: true });

          if (schema[i].indexes !== undefined) {
            for (let j = 0; j < schema[i].indexes.length; j++) {
              const index = schema[i].indexes[j];
              store.createIndex(`${index}_idx`, index);
            }
          }

          if (schema[i].seeds !== undefined) {
            for (let j = 0; j < schema[i].seeds.length; j++) {
              const seed = schema[i].seeds[j];
              store.put(seed);
            }
          }
        }

        observer.next('done');
      };

      instance.onerror = () => {
        console.error('IndexedDbService: Error in create() function');
        this.handleError(instance.error);
        observer.error(instance.error);
      };

      instance.onsuccess = () => {
        console.log('IndexedDbService: Db created successfully');
        this._dbInstance = instance;
        observer.complete();
      };
    });
  }

  public clear(): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      const request = this._indexedDB.deleteDatabase(this._dbName);

      request.onsuccess = () => {
        observer.next('done');
        observer.complete();
      };
      request.onerror = () => {
        self.handleError('Could not delete indexed db.');
      };
      request.onblocked = () => {
        self.handleError('Could not delete database due to the operation being blocked.');
      };
    });
  }

  private handleError(msg: any): Observable<any> {
    console.error(msg);
    return observableThrowError(msg);
  }

  private open(): Observable<any> {
    return Observable.create((observer: any) => {
      if (this._isInitialized) {
        observer.next(this._dbInstance.result);
        observer.complete();
        return;
      }

      const instance = this._indexedDB.open(this._dbName);

      instance.onsuccess = () => {
        this._dbInstance = instance;
        observer.next(this._dbInstance.result);
        observer.complete();
      };
      instance.onerror = () => {
        console.error('IndexedDbService: Error in open() function');
        this.handleError(instance.error);
      };
    });
  }
}
