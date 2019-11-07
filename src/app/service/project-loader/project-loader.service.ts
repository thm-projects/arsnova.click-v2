import { Injectable } from '@angular/core';
import { Project } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class ProjectLoaderService {
  public readonly projects = Project;

  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  set connected(value: boolean) {
    this._connected = value;
  }

  private _currentProject = Project.Frontend;

  get currentProject(): Project {
    return this._currentProject;
  }

  set currentProject(value: Project) {
    this._currentProject = value;
    this._connected = false;
  }

  constructor() { }

}
