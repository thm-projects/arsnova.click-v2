import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AbstractQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_abstract';
import { Observable, of } from 'rxjs';
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
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    if (value instanceof AbstractQuestionGroup) {
      value = value.serialize();
    }

    return this.indexedDbService.put(table, {
      id: this.formatKey(key),
      value,
    });
  }

  public read(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.get(table, this.formatKey(key));
  }

  public delete(table: DB_TABLE, key: string | STORAGE_KEY): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.remove(table, this.formatKey(key));
  }

  public async getAllQuiznames(): Promise<Array<string>> {
    if (isPlatformServer(this.platformId)) {
      return of(null).toPromise();
    }

    return (
      await this.indexedDbService.all(DB_TABLE.QUIZ).toPromise()
    ).map(value => value.id);
  }

  public getAll(table: DB_TABLE): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    return this.indexedDbService.all(table);
  }

  private formatKey(key: string | STORAGE_KEY): string {
    return key.toString().toLowerCase();
  }
}
