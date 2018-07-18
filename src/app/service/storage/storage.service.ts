import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { DB_NAME, DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { IndexedDbService } from './indexed.db.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private indexedDbService: IndexedDbService) {

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.indexedDbService.setName(DB_NAME.DEFAULT);
    this.indexedDbService.create([
      { name: DB_TABLE.CONFIG }, {
        name: DB_TABLE.QUIZ,
      },
    ]).subscribe();
  }

  public create(table: DB_TABLE, key: string | STORAGE_KEY, value: any): Observable<any> {
    return this.indexedDbService.put(table, {
      id: this.formatKey(key),
      value,
    });
  }

  public read(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    return this.indexedDbService.get(table, this.formatKey(key));
  }

  public delete(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    return this.indexedDbService.remove(table, this.formatKey(key));
  }

  public async getAllQuiznames(): Promise<Array<string>> {
    return (
      await this.indexedDbService.all(DB_TABLE.QUIZ).toPromise()
    ).map(value => value.id);
  }

  public getAll(table: DB_TABLE): Observable<any> {
    return this.indexedDbService.all(table);
  }

  private formatKey(key: string | STORAGE_KEY): string {
    return key.toString().toLowerCase();
  }
}
