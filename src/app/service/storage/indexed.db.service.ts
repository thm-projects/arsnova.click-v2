import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

interface ISchema {
  name: DB_TABLE;
  indexes?: Array<string>;
  seeds?: Array<any>;
}

@Injectable()
export class IndexedDbService {
  private _indexedDB: any;
  private _dbName: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._indexedDB = indexedDB;
    }

    this._dbName = 'db'; // by default
  }

  public setName(dbName: string): void {
    if (dbName.length > 0 && dbName !== undefined) {
      this._dbName = dbName;
    } else {
      console.log('Error: invalid dbName');
    }
  }

  public put(source: DB_TABLE, object: any): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);
        store.put(object);

        tx.oncomplete = () => {
          observer.next(object);
          db.close();
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public post(source: DB_TABLE, object: any): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);
        const request = store.add(object);

        request.onsuccess = (e: any) => {
          observer.next(e.target.result);
          db.close();
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public get(source: DB_TABLE, id: STORAGE_KEY | string): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readonly');
        const store = tx.objectStore(source);
        const index = store.index('id_idx');
        const request = index.get(id);

        request.onsuccess = () => {
          observer.next(request.result ? request.result.value ? request.result.value : request.result : null);
          db.close();
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public all(source: DB_TABLE, filter?: string): Observable<any[]> {
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
            db.close();
            observer.complete();
          }
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public remove(source: DB_TABLE, id: STORAGE_KEY | string): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        const tx = db.transaction(source, 'readwrite');
        const store = tx.objectStore(source);

        store.delete(id);

        tx.oncomplete = (e: any) => {
          observer.next(id);
          db.close();
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public count(source: DB_TABLE): Observable<number> {
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
          db.close();
          observer.complete();
        };
        db.onerror = (e: any) => {
          db.close();
          self.handleError('IndexedDB error: ' + e.target.errorCode);
        };
      });
    });
  }

  public create(schema?: Array<ISchema>): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      const request = this._indexedDB.open(this._dbName);

      request.onupgradeneeded = () => {
        // The database did not previously exist, so create object stores and indexes.
        const db = request.result;

        for (let i = 0; i < schema.length; i++) {
          const store = db.createObjectStore(schema[i].name, {
            keyPath: 'id',
            autoIncrement: true,
          });
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
        observer.complete();
      };

      request.onerror = () => {
        self.handleError(request.error);
      };

      request.onsuccess = () => {
        const db = request.result;
        db.close();
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

  private handleError(msg: string): Observable<any> {
    console.error(msg);
    return Observable.throw(msg);
  }

  private open(): Observable<any> {
    const self = this;

    return Observable.create((observer: any) => {
      const request = this._indexedDB.open(this._dbName);

      request.onsuccess = () => {
        observer.next(request.result);
        observer.complete();
      };
      request.onerror = () => self.handleError(request.error);
    });
  }
}
