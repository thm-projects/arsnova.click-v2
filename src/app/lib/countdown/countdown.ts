import { EventEmitter } from '@angular/core';

export class Countdown {
  public onChange = new EventEmitter<number>();

  private _isRunning: boolean;

  get isRunning(): boolean {
    return this._isRunning;
  }

  private _hasFinished: boolean;

  get hasFinished(): boolean {
    return this._hasFinished;
  }

  private _remainingTime: number;

  get remainingTime(): number {
    return this._remainingTime;
  }

  set remainingTime(value: number) {
    this._remainingTime = value;
  }

  private readonly _interval: any;

  constructor(timer: number) {
    if (timer <= 0) {
      return;
    }

    this._remainingTime = timer;
    this._isRunning = true;

    this._interval = setInterval(() => {

      this._remainingTime--;

      if (this._remainingTime === 0) {
        this._hasFinished = true;
      }

      if (this._remainingTime <= 0) {
        clearInterval(this._interval);
        this._remainingTime = 0;
        this._isRunning = false;
      }

      this.onChange.next(this._remainingTime);
    }, 1000);
  }

  public stop(): void {
    clearInterval(this._interval);
    this._remainingTime = 0;
    this._isRunning = false;
    this._hasFinished = true;
  }
}
