import { Injectable } from '@angular/core';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/dist/communication_protocol';
import { PROJECT } from '../../shared/enums';
import { I18nManagerApiService } from '../api/i18n-manager/i18n-manager-api.service';
import { UserService } from '../user/user.service';

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

  private _isAuthorized = false;

  get isAuthorized(): boolean {
    return this._isAuthorized;
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

  constructor(private i18nManagerApiService: I18nManagerApiService, private userService: UserService) { }

  public async isAuthorizedForProject(project: PROJECT): Promise<boolean> {
    if (!this.userService.isLoggedIn) {
      this._isAuthorized = false;
      return false;
    }

    try {
      const isAuthorized = (
                             await this.i18nManagerApiService.isAuthorizedForProject(project, {
                               username: this.userService.username,
                               token: this.userService.staticLoginToken,
                             }).toPromise()
                           ).status === COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL;

      this._isAuthorized = isAuthorized;

      return isAuthorized;
    } catch (e) {
      this._isAuthorized = false;
      return false;
    }
  }
}
