import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppDb } from '../../lib/db/app.db';
import { DbState, StorageKey } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _db: AppDb;
  private readonly _closeDb = new Subject();

  public readonly stateNotifier = new ReplaySubject<DbState>(1);

  get db(): AppDb {
    return this._db;
  }

  constructor() {}

  public switchDb(username: string): Observable<void> {
    if (this._db && this._db.name === username) {
      return this._db.initialized;
    }

    return this.initDb(username);
  }

  private initDb(dbName): Observable<void> {
    if (this._db) {
      this._db.close();
      this._closeDb.next();
      this.stateNotifier.next(DbState.Destroy);
    }

    this._db = new AppDb(dbName);

    this._db.initialized.pipe(takeUntil(this._closeDb)).subscribe(() => this.stateNotifier.next(DbState.Initialized));
    return this._db.initialized;
  }


  private formatKey(key: string | StorageKey): string {
    return key.toString().toLowerCase();
  }
}
