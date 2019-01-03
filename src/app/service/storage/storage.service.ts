import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DbName, DbTable, StorageKey } from '../../../lib/enums/enums';
import { IndexedDbService } from './indexed.db.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  public readonly stateNotifier = this.indexedDbService.stateNotifier.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private indexedDbService: IndexedDbService) {

    if (isPlatformServer(this.platformId)) {
      return;
    }
  }

  public create(table: DbTable, key: string | StorageKey, value: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.put(table, {
      id: this.formatKey(key),
      value,
    });
  }

  public read(table: DbTable, key: string | StorageKey): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.get(table, this.formatKey(key));
  }

  public delete(table: DbTable, key: string | StorageKey): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.remove(table, this.formatKey(key));
  }

  public async getAllQuiznames(): Promise<Array<string>> {
    if (isPlatformServer(this.platformId)) {
      return of(null).toPromise();
    }

    return (await this.indexedDbService.all(DbTable.Quiz).toPromise()).map(value => value.id);
  }

  public getAll(table: DbTable): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.all(table);
  }

  public switchDb(username: string): void {
    if (username === this.indexedDbService.dbName) {
      return;
    }

    this.indexedDbService.dbInstance = null;
    this.initDb(username || DbName.Default);
  }

  private initDb(dbName): void {
    this.indexedDbService.setName(dbName);
    this.indexedDbService.create([
      { name: DbTable.Config }, {
        name: DbTable.Quiz,
      },
    ]).subscribe(() => {}, () => {}, () => {
      this.read(DbTable.Config, StorageKey.PrivateKey).subscribe(val => {
        if (!val) {
          val = this.generatePrivateKey();
          this.create(DbTable.Config, StorageKey.PrivateKey, val).subscribe();
        }
        localStorage.setItem('privateKey', val);
        this.indexedDbService.stateNotifier.next('initialized');
      });
    });
  }

  private generatePrivateKey(length?: number): string {
    const arr = new Uint8Array((length || 40) / 2);

    if (isPlatformBrowser(this.platformId)) {
      window.crypto.getRandomValues(arr);
    }

    return Array.from(arr, this.dec2hex).join('');
  }

  private dec2hex(dec): string {
    return ('0' + dec.toString(16)).substr(-2);
  }


  private formatKey(key: string | StorageKey): string {
    return key.toString().toLowerCase();
  }
}
