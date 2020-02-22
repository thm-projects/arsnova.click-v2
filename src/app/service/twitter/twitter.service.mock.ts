import { Injectable } from '@angular/core';
import {ITweetEntry} from '../../lib/interfaces/ITweetEntry';

@Injectable({
  providedIn: 'root'
})
export class TwitterServiceMock {
  public tweets: ITweetEntry[] = [];

  constructor() { }

  public setOptIn(): void {
  }

  public refreshTweets(): void {
  }

  public getOptIn(): boolean {
    return true;
  }
}
