import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DbTable, StorageKey } from '../../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceMock {

  public stateNotifier = of(null);
  private _storage: any = {};

  constructor() {
    this._storage[DbTable.Quiz] = {};
    this._storage[DbTable.Config] = {};
  }

  public create(table: DbTable, key: string | StorageKey, value: any): Observable<any> {
    this._storage[table][key] = value;
    return of(null);
  }

  public read(table: DbTable, key: string | StorageKey): Observable<any> {
    return of(this._storage[table][key] || null);
  }

  public delete(table: DbTable, key: string | StorageKey): Observable<any> {
    delete this._storage[table][key];
    return of(null);
  }

  public async getAllQuiznames(): Promise<any> {
    return new Promise(resolve => resolve(Object.keys(this._storage[DbTable.Quiz]).map(key => key)));
  }

  public getAll(table: DbTable): Observable<any> {
    return of(Object.keys(this._storage[table]).map(key => {
      return { value: JSON.parse(this._storage[table][key]) };
    }));
  }
}
