import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITweetEntry } from '../../lib/interfaces/ITweetEntry';

@Injectable({
  providedIn: 'root',
})
export class TwitterServiceMock {
  public tweets: ITweetEntry[] = [];

  constructor() { }

  public setOptIn(): void {
  }

  public refreshTweets(): Observable<Array<ITweetEntry>> {
    return of([]);
  }

  public getOptIn(): boolean {
    return true;
  }
}
