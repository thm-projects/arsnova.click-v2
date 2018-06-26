import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceMock {

  private _storage: any = {};

  constructor() {
    this._storage[DB_TABLE.QUIZ] = {};
    this._storage[DB_TABLE.CONFIG] = {};
  }

  public create(table: DB_TABLE, key: string | STORAGE_KEY, value: any): Observable<any> {
    this._storage[table][key] = value;
    return of(null);
  }

  public read(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    return of(this._storage[table][key] || null);
  }

  public delete(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    delete this._storage[table][key];
    return of(null);
  }

  public async getAllQuiznames(): Promise<any> {
    return new Promise(resolve => resolve(Object.keys(this._storage[DB_TABLE.QUIZ]).map(key => key)));
  }

  public getAll(table: DB_TABLE): Observable<any> {
    return of(Object.keys(this._storage[table]).map(key => {
      return { value: JSON.parse(this._storage[table][key]) };
    }));
  }
}
