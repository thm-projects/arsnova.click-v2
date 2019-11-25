import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DbTable, StorageKey } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceMock {
  public stateNotifier = of(null);

  private _db: any = {
    initialized: of(true),
  };

  get db(): any {
    return this._db;
  }

  constructor() {
    this._db[DbTable.Quiz] = {
      get: () => new Promise(resolve => resolve()),
      delete: () => new Promise(resolve => resolve()),
      toCollection: () => {
        return {
          sortBy: () => new Promise(resolve => resolve([])),
          each: () => new Promise(resolve => resolve([])),
        };
      },
    };
    this._db[DbTable.Config] = {
      get: () => new Promise(resolve => resolve()),
      delete: () => new Promise(resolve => resolve()),
      toCollection: () => {
        return {
          sortBy: (data) => new Promise(resolve => resolve(data)),
          each: (data) => new Promise(resolve => resolve(data)),
        };
      },
    };
  }

  public create(table: DbTable, key: string | StorageKey, value: any): Observable<any> {
    this._db[table][key] = value;
    return of(null);
  }

  public read(table: DbTable, key: string | StorageKey): Observable<any> {
    return of(this._db[table][key] || null);
  }

  public delete(table: DbTable, key: string | StorageKey): Observable<any> {
    delete this._db[table][key];
    return of(null);
  }

  public async getAllQuiznames(): Promise<any> {
    return new Promise(resolve => resolve(Object.keys(this._db[DbTable.Quiz]).map(key => key)));
  }

  public getAll(table: DbTable): Observable<any> {
    return of(Object.keys(this._db[table]).map(key => {
      return { value: JSON.parse(this._db[table][key]) };
    }));
  }

  public switchDb(): Observable<void> {
    return of(null);
  }
}
