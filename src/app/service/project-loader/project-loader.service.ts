import { Injectable } from '@angular/core';
import { PROJECT } from '../../../../../../arsnova-click-v2-manager/src/app/shared/enums';

@Injectable({
  providedIn: 'root',
})
export class ProjectLoaderService {
  public readonly projects = PROJECT;

  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  set connected(value: boolean) {
    this._connected = value;
  }

  private _currentProject = PROJECT.FRONTEND;

  get currentProject(): PROJECT {
    return this._currentProject;
  }

  set currentProject(value: PROJECT) {
    this._currentProject = value;
    this._connected = false;
  }

  private _currentBranch = '';

  get currentBranch(): string {
    return this._currentBranch;
  }

  set currentBranch(value: string) {
    this._currentBranch = value;
  }

  constructor() { }
}
