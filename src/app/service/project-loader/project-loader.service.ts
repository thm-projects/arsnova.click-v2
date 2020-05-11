import { Injectable } from '@angular/core';
import { Project } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class ProjectLoaderService {
  private _connected = false;
  private _currentProject = Project.Frontend;

  public readonly projects = Project;

  get connected(): boolean {
    return this._connected;
  }

  set connected(value: boolean) {
    this._connected = value;
  }

  get currentProject(): Project {
    return this._currentProject;
  }

  set currentProject(value: Project) {
    this._currentProject = value;
    this._connected = false;
  }

  constructor() { }

}
