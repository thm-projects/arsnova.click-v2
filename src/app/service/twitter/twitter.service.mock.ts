import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ITweetEntry } from '../../lib/interfaces/ITweetEntry';

@Injectable({
  providedIn: 'root',
})
export class TwitterServiceMock {
  public tweets = new ReplaySubject<Array<ITweetEntry>>(1);

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
