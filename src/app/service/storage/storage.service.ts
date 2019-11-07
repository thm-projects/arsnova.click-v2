import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AppDb } from '../../lib/db/app.db';
import { DbName, DbState, StorageKey } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public readonly stateNotifier = new ReplaySubject<DbState>(1);

  private _db: AppDb;

  get db(): AppDb {
    return this._db;
  }

  constructor() {}

  public switchDb(username: string): Observable<void> {
    if (this._db && this._db.name === username) {
      this.stateNotifier.next(DbState.Initialized);
      return this._db.initialized;
    }

    return this.initDb(username || DbName.Default);
  }

  private initDb(dbName): Observable<void> {
    if (this._db) {
      this._db.close();
    }

    this._db = new AppDb(dbName);

    this._db.initialized.subscribe(() => this.stateNotifier.next(DbState.Initialized));
    return this._db.initialized;
  }


  private formatKey(key: string | StorageKey): string {
    return key.toString().toLowerCase();
  }
}
