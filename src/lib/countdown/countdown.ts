import { EventEmitter } from '@angular/core';
import { AbstractQuestionEntity } from '../entities/question/AbstractQuestionEntity';

export class Countdown {
  public onChange = new EventEmitter<number>();

  private _isRunning: boolean;

  get isRunning(): boolean {
    return this._isRunning;
  }

  private _remainingTime: number;

  get remainingTime(): number {
    return this._remainingTime;
  }

  set remainingTime(value: number) {
    this._remainingTime = value;
  }

  private readonly _time: number;
  private readonly _interval: any;

  constructor(question: AbstractQuestionEntity, startTimestamp: number) {
    this._time = question.timer;
    const endTimestamp = startTimestamp + this._time * 1000;
    this._remainingTime = Math.round((endTimestamp - new Date().getTime()) / 1000);
    console.log('Init countdown', startTimestamp, endTimestamp, this._time, this._remainingTime);
    if (this._remainingTime <= 0) {
      return;
    }
    this._isRunning = true;
    this._interval = setInterval(() => {
      this._remainingTime--;
      this.onChange.next(this._remainingTime);
      if (this._remainingTime <= 0) {
        this._isRunning = false;
        clearInterval(this._interval);
      }
    }, 1000);
  }

  public stop(): void {
    clearInterval(this._interval);
    this._remainingTime = 0;
    this._isRunning = false;
  }
}
